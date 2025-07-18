package com.rule_engine.dto;

import lombok.Data;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class LogEntry {
    private String _id;

    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    // private Date timestamp;

    private String service;
    private String level;
    private String type;
    private String message;
    
    // @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    // private Date createdAt;
    
    private String _class;
}