package com.data_collector.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "logs")
public class LogEntry {
    @Id
    private String id;
    
    @Indexed
    private String logId;
    
    @Indexed
    private Instant timestamp;
    
    @Indexed
    private String service;

    @Indexed
    private String level;
    
    private String type;
    private String message;
    
    private HttpDetails httpDetails;

    @Data
    public static class HttpDetails {
        private String method;
        private String path;
        private Integer statusCode;
        private Integer responseTime;
        private String httpMessage;
    }
    
    @Indexed
    private Instant createdAt = Instant.now();
}