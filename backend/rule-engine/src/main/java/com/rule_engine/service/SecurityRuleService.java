package com.rule_engine.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.rule_engine.dto.AlertMessage;
import com.rule_engine.dto.SecurityEvent;

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
        return "threat".equals(event.getType()) && ("critical".equals(event.getSeverity()) || "high".equals(event.getSeverity()));
    }
}