package com.alert_manager.model;

import java.util.Date;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "alerts")
public class Alert {
    @Id
    private String id;
    private String ruleType;
    private String message;
    private String service;
    private String severity;
    private AlertStatus status = AlertStatus.OPEN;
    private String assignedTo;
    private String resolutionNotes;
    private Map<String, Object> payload;
    private Date createdAt = new Date();
    private Date updatedAt = new Date();

    public enum AlertStatus {
        OPEN, IN_PROGRESS, RESOLVED, DISMISSED
    }
}
