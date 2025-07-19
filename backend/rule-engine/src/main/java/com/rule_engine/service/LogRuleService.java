package com.rule_engine.service;

import com.rule_engine.dto.AlertMessage;
import com.rule_engine.dto.LogEntry;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class LogRuleService {
    
    private final AlertService alertService;
    
    public LogRuleService(AlertService alertService) {
        this.alertService = alertService;
    }
    
    @RabbitListener(queues = "log-queue")
    public void processLog(LogEntry log) {
        if (isErrorLog(log)) {
            alertService.sendAlert(new AlertMessage(
                "LOG_ERROR",
                "Error log detected from " + log.getService(),
                log
            ));
        }
    }
    
    private boolean isErrorLog(LogEntry log) {
        return "error".equalsIgnoreCase(log.getLevel());
    }
}