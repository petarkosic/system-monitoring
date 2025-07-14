package com.data_collector.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
@Document(collection = "security_events")
public class SecurityEvent implements Serializable {
    @Id
    private String id;
    
    @Indexed
    private String eventId = UUID.randomUUID().toString();
    
    @Indexed
    private Instant timestamp;
    
    @Indexed
    private String type;
    private String severity;
    private String service;
    private String message;
    
    private String ipAddress;
    private String userAgent;
    private String userId;
    private Map<String, Object> details;
    
    @Indexed
    private Instant createdAt = Instant.now();
}