package com.data_collector.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.data_collector.model.LogEntry;
import com.data_collector.service.LogService;
import com.data_collector.service.RabbitMQService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final RabbitMQService rabbitMQService;
    private final LogService logService;

    @PostMapping
    public ResponseEntity<LogEntry> saveLog(@RequestBody LogEntry logEntry) {
        LogEntry savedLog = logService.saveLog(logEntry);
        rabbitMQService.sendLogToQueue(savedLog);
        
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping("/service/{service}")
    public ResponseEntity<List<LogEntry>> getLogsByService(@PathVariable String service) {
        return ResponseEntity.ok(logService.getLogsByService(service));
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<LogEntry>> getLogsByLevel(@PathVariable String level) {
        return ResponseEntity.ok(logService.getLogsByLevel(level));
    }
}