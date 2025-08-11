package com.alert_manager.service;

import java.text.SimpleDateFormat;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.alert_manager.dto.WebSocketAlertDto;
import com.alert_manager.model.Alert;

@Service
public class WebSocketService {
    private final SimpMessagingTemplate messagingTemplate;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendAlert(Alert alert) {
        WebSocketAlertDto webSocketAlertDto = new WebSocketAlertDto();
        
        webSocketAlertDto.setId(alert.getId());
        webSocketAlertDto.setRuleType(alert.getRuleType());
        webSocketAlertDto.setMessage(alert.getMessage());
        webSocketAlertDto.setService(alert.getService());
        webSocketAlertDto.setSeverity(alert.getSeverity());
        webSocketAlertDto.setStatus(alert.getStatus().name());
        webSocketAlertDto.setTimestamp(dateFormat.format(alert.getCreatedAt()));
        webSocketAlertDto.setSummary(alert.getRuleType() + " in " + alert.getService());

        messagingTemplate.convertAndSend("/topic/alerts", webSocketAlertDto);
    }
}
