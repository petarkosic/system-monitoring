package com.data_collector.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

@Data
@Document(collection = "metrics")
public class Metric implements Serializable {
    @Id
    private String id;
    
    @Indexed
    private String metricId = UUID.randomUUID().toString();
    
    @Indexed
    private Instant timestamp;
    
    @Indexed
    private String service;
    private Double cpu;
    private Double memory;
    private String memoryUnits;
    private Double disk;
    private Double networkIn;
    private Double networkOut;
    
    @Indexed
    private Instant createdAt = Instant.now();
}