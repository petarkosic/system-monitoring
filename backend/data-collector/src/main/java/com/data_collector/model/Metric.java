package com.data_collector.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "metrics")
public class Metric {
    @Id
    private String id;
    
    @Indexed
    private String metricId;
    
    @Indexed
    private Instant timestamp;
    
    @Indexed
    private String service;
    
    private Double cpu;
    private Integer baseMemory;
    private Double memory;
    private String memoryUnits;
    private Double disk;
    private Double networkIn;
    private Double networkOut;
    
    @Indexed
    private Instant createdAt = Instant.now();
}