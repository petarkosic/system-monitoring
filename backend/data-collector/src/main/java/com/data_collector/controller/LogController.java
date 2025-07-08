package com.data_collector.controller;

import com.data_collector.model.LogEntry;
import com.data_collector.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {
    private final LogService logService;

    @PostMapping
    public ResponseEntity<LogEntry> saveLog(@RequestBody LogEntry logEntry) {
        return ResponseEntity.ok(logService.saveLog(logEntry));
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