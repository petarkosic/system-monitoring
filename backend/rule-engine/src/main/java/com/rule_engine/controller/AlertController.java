package com.rule_engine.controller;

import com.rule_engine.dto.AlertMessage;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AlertController {
    
    @RabbitListener(queues = "alert-queue")
    public void handleAlert(AlertMessage alert) {
        System.out.println("Received Alert: " + alert.getMessage());
        System.out.println("Rule Type: " + alert.getRuleType());
        System.out.println("Payload: " + alert.getPayload());
    }
}