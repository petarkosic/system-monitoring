package com.alert_manager.dto;

import lombok.Data;

@Data
public class WebSocketAlertDto {
    private String id;
    private String ruleType;
    private String message;
    private String service;
    private String severity;
    private String status;
    private String timestamp;
    private String summary;
}
