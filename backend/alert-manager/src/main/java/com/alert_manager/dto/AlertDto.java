package com.alert_manager.dto;

import java.util.Map;

import lombok.Data;

@Data
public class AlertDto {
    private String ruleType;
    private String message;
    private Map<String, Object> payload;
}
