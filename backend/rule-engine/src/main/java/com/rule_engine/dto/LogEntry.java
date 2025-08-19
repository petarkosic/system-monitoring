package com.rule_engine.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.OptBoolean;

import lombok.Data;

@Data
public class LogEntry {
    private String id;

    private String logId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss",lenient = OptBoolean.TRUE)
    private Date timestamp;

    private String service;
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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss", lenient = OptBoolean.TRUE)
    private Date createdAt;
}