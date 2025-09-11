from datetime import datetime
import json
import os
from openai import OpenAI
from typing import List
from models import Alert, Solution, AlertType
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class AIAlertAgent:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("API_KEY"), base_url=os.getenv("BASE_URL"))
        self.knowledge_base_path = Path("knowledge_base")
        
    def _get_knowledge_base_file(self, alert_type: AlertType) -> Path:
        return self.knowledge_base_path / f"{alert_type.value}_solutions.json"
    
    def _load_solutions(self, alert_type: AlertType) -> List[Solution]:
        file_path = self._get_knowledge_base_file(alert_type)

        if not file_path.exists():
            return []
        
        with open(file_path, 'r') as f:
            data = json.load(f)
            return [Solution(**item) for item in data]
    
    def _save_solutions(self, alert_type: AlertType, solutions: List[Solution]):
        file_path = self._get_knowledge_base_file(alert_type)

        with open(file_path, 'w') as f:
            json.dump([s.dict() for s in solutions], f, indent=2)
    
    def _detect_alert_type(self, alert: Alert) -> AlertType:
        if "logId" in alert.payload:
            return AlertType.LOG
        elif "metricId" in alert.payload:
            return AlertType.METRIC
        elif "eventId" in alert.payload:
            return AlertType.SECURITY
        else:
            return AlertType.LOG
    
    def _find_relevant_solutions(self, alert: Alert, tried_solutions: List[str] = None) -> List[Solution]:
        if tried_solutions is None:
            tried_solutions = []
        
        alert_type = self._detect_alert_type(alert)
        all_solutions = self._load_solutions(alert_type)
        
        relevant_solutions = [
            s for s in all_solutions 
            if s.id not in tried_solutions
        ]
        
        relevant_solutions.sort(key=lambda x: (-x.effectiveness_score, x.times_used))

        return relevant_solutions[:5]
    
    def _generate_ai_solutions(self, alert: Alert, tried_solutions: List[Solution] = None) -> List[Solution]:
        if tried_solutions is None:
            tried_solutions = []

        prompt = f"""
        You are an expert DevOps engineer analyzing system alerts. Please provide detailed yet concise solutions for the following alert.

        Alert Details:
        - Rule Type: {alert.ruleType}
        - Service: {alert.service}
        - Severity: {alert.severity}
        - Message: {alert.message}
        - Payload: {json.dumps(alert.payload, indent=2)}

        {"Tried solutions that didn't work: " + ", ".join([s.problem_pattern for s in tried_solutions]) if tried_solutions else "No solutions have been tried yet."}

        Please provide 3-5 potential solutions with the following structure for each:
        1. Problem Pattern: A brief description of the problem this solution addresses
        2. Solution Steps: Detailed, step-by-step instructions to resolve the issue
        3. Expected Outcome: What should happen if this solution works

        
        IMPORTANT: Your response MUST be a valid JSON array with objects containing these exact field names:
        - problem_pattern (string)
        - solution_steps (array of strings)
        - expected_outcome (string)

        Example of valid response format:
        [
            {{
                "problem_pattern": "High memory usage in service",
                "solution_steps": [
                    "1. Check memory usage with 'top' or 'htop'",
                    "2. Identify memory-hungry processes",
                    "3. Restart the service if it's leaking memory"
                ],
                "expected_outcome": "Memory usage returns to normal levels"
            }}
        ]


        Be specific, actionable, and provide clear step-by-step instructions.
        Consider the service type, severity, and specific details in the payload.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gemini-2.0-flash",
                messages=[
                    {"role": "system", "content": "You are a helpful DevOps expert specializing in system monitoring and alert resolution. Always return valid JSON arrays with the exact field names specified."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            
            content = response.choices[0].message.content.strip()

            solutions_data = json.loads(content)

            solutions = []
            for i, data in enumerate(solutions_data):
                solution = Solution(
                    id=f"ai_{alert.id}_{i}_{datetime.now().strftime('%Y%m%d%H%M%S')}",
                    alert_type=self._detect_alert_type(alert),
                    problem_pattern=data["problem_pattern"],
                    solution_steps=data["solution_steps"],
                    effectiveness_score=data['effectiveness_score'],
                    service=alert.service,
                    severity=alert.severity,
                    rule_type=alert.ruleType,
                    keywords=data.get("keywords", "").split(",") if data.get("keywords") else [],
                    created_at=datetime.now().isoformat(),
                    times_used=0
                )
                solutions.append(solution)

            return solutions
            
        except Exception as e:
            print(f"Error generating AI solutions: {e}")

            return [
                Solution(
                    id=f"ai_fallback_{alert.id}",
                    alert_type=self._detect_alert_type(alert),
                    problem_pattern="General system issue",
                    solution_steps=[
                        "1. Check system logs for detailed error messages",
                        "2. Verify service health and dependencies",
                        "3. Restart the service if appropriate",
                        "4. Check resource utilization (CPU, memory, disk)",
                        "5. Verify network connectivity"
                    ],
                    effectiveness_score=30
                )
            ]
    
    def get_solutions(self, alert: Alert, tried_solution_ids: List[str] = None) -> dict:
        if tried_solution_ids is None:
            tried_solution_ids = []
        
        knowledge_base_solutions = self._find_relevant_solutions(alert, tried_solution_ids)
        
        if knowledge_base_solutions:
            return {
                "solutions": knowledge_base_solutions,
                "source": "knowledge_base"
            }
        
        tried_solutions = []
        if tried_solution_ids:
            alert_type = self._detect_alert_type(alert)
            all_solutions = self._load_solutions(alert_type)
            tried_solutions = [s for s in all_solutions if s.id in tried_solution_ids]
        
        ai_solutions = self._generate_ai_solutions(alert, tried_solutions)
        
        return {
            "solutions": ai_solutions,
            "source": "ai"
        }
    
    def record_solution_feedback(self, solution: Solution, alert: Alert, worked: bool, comments: str = None):
        alert_type = self._detect_alert_type(alert)
        all_solutions = self._load_solutions(alert_type)
        
        solution_index = next((i for i, s in enumerate(all_solutions) if s.id == solution.id), None)
        
        if solution_index is not None:
            solution = all_solutions[solution_index]
            solution.times_used += 1
            
            if worked:
                solution.effectiveness_score = min(100, solution.effectiveness_score + 10)
            else:
                solution.effectiveness_score = max(0, solution.effectiveness_score - 5)
        else:
            new_solution = Solution(
                id=solution.id,
                alert_type=alert_type,
                problem_pattern=solution.problem_pattern,
                solution_steps=solution.solution_steps,
                effectiveness_score=solution.effectiveness_score,
                service=alert.service,
                severity=alert.severity,
                rule_type=alert.ruleType,
                created_at=datetime.now().isoformat(),
                times_used=1
            )

            all_solutions.append(new_solution)

        self._save_solutions(alert_type, all_solutions)