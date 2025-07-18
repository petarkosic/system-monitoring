package com.rule_engine.dto;

import lombok.Data;
import java.util.Date;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class SecurityEvent {
    private String _id;

    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    // private Date timestamp;

    private String type;
    private String severity;
    private String service;
    private String message;
    private String ipAddress;
    private String userAgent;
    private String userId;
    private Map<String, Object> details;

    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    // private Date createdAt;

    private String _class;
}