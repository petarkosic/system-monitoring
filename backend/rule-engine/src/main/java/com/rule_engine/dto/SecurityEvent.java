package com.rule_engine.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.OptBoolean;

import lombok.Data;

@Data
public class SecurityEvent {
    private String id;

    private String eventId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", lenient = OptBoolean.TRUE)
    private Date timestamp;

    private String type;
    private String severity;
    private String service;
    private String message;
    private String ipAddress;
    private String userAgent;
    private String userId;
    private Details details;

    @Data
    public static class Details {
        private String requestId;
        private String location;
        private Integer threatScore;
        private String sessionId;
        private Integer sourcePort;
        private Integer destinationPort;
        private Integer bytesTransferred;
        private String fileHash;
        private String deviceType;
        private String method;
        private String endpoint;
        private String serviceAccount;
        private String operation;
        private String policyName;
        private String username;
        private String envVar;
        private String service;
        private String origin;
        private String email;
        private String maliciousPayload;
        private String payload;
        private String threatType;
        private String domain;
        private String reportName;
    }

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", lenient = OptBoolean.TRUE)
    private Date createdAt;
}