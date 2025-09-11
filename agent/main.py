from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from models import AnalysisRequest, SolutionFeedback
from agent import AIAlertAgent

app = FastAPI(title="Alert Resolution AI Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai_agent = AIAlertAgent()

@app.post("/api/analyze-alert")
async def analyze_alert(request: AnalysisRequest):
    try:
        result = ai_agent.get_solutions(request.alert, request.tried_solutions)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing alert: {str(e)}")

@app.post("/api/record-feedback")
async def record_feedback(feedback: SolutionFeedback):
    try:
        ai_agent.record_solution_feedback(
            feedback.solution, 
            feedback.alert,
            feedback.worked, 
            feedback.comments
        )
        return {"message": "Feedback recorded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recording feedback: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)