package com.rule_engine.dto;

import lombok.Data;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class Metric {
    private String _id;

    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    // private Date timestamp;
    
    private String service;
    private Integer cpu;
    private Integer memory;
    private String memoryUnits;
    private Integer disk;
    private Integer networkIn;
    private Integer networkOut;

    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    // private Date createdAt;

    private String _class;
}