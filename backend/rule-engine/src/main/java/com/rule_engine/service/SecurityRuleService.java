package com.rule_engine.service;

import com.rule_engine.dto.AlertMessage;
import com.rule_engine.dto.SecurityEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class SecurityRuleService {
    
    private final AlertService alertService;
    
    public SecurityRuleService(AlertService alertService) {
        this.alertService = alertService;
    }
    
    @RabbitListener(queues = "security-event-queue")
    public void processSecurityEvent(SecurityEvent event) {
        if (isCriticalThreat(event)) {
            alertService.sendAlert(new AlertMessage(
                "CRITICAL_SECURITY_THREAT",
                "Critical security threat detected from " + event.getService(),
                event
            ));
        }
    }
    
    private boolean isCriticalThreat(SecurityEvent event) {
        return "THREAT".equals(event.getType()) && ("CRITICAL".equals(event.getSeverity()) || "HIGH".equals(event.getSeverity()));
    }
}