package com.rule_engine.dto;

import lombok.Data;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.OptBoolean;

@Data
public class Metric {
    private String id;

    private String metricId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", lenient = OptBoolean.TRUE)
    private Date timestamp;
    
    private String service;
    private Integer cpu;
    private Integer baseMemory;
    private Integer memory;
    private String memoryUnits;
    private Integer disk;
    private Integer networkIn;
    private Integer networkOut;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", lenient = OptBoolean.TRUE)
    private Date createdAt;
}