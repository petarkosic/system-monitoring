package com.data_collector.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Data
@Document(collection = "logs")
public class LogEntry implements Serializable {
    @Id
    private String id;
    
    @Indexed
    private String logId = UUID.randomUUID().toString();
    
    @Indexed
    private Instant timestamp;
    
    @Indexed
    private String service;
    private String level;
    private String type;
    private String message;
    
    private String method;
    private String path;
    private Integer statusCode;
    private Integer responseTime;
    private String httpMessage;
    
    @Indexed
    private Instant createdAt = Instant.now();
}