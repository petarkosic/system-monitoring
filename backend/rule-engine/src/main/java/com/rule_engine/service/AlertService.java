package com.rule_engine.service;

import com.rule_engine.dto.AlertMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class AlertService {
    
    private final RabbitTemplate rabbitTemplate;
    private static final String ALERT_QUEUE = "alert-queue";
    
    public AlertService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }
    
    public void sendAlert(AlertMessage alert) {
        rabbitTemplate.convertAndSend(ALERT_QUEUE, alert);
    }
}