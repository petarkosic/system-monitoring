package com.data_collector.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "security_events")
public class SecurityEvent {
    @Id
    private String id;
    
    @Indexed
    private String eventId;
    
    @Indexed
    private Instant timestamp;
    
    @Indexed
    private String type;

    @Indexed
    private String severity;

    @Indexed
    private String service;
    private String message;
    
    private String ipAddress;
    private String userAgent;
    private String userId;
    private Details details;
    private String status = "open";    

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

    @Indexed
    private Instant createdAt = Instant.now();
}