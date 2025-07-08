package com.data_collector.controller;

import com.data_collector.model.SecurityEvent;
import com.data_collector.service.SecurityEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security-events")
@RequiredArgsConstructor
public class SecurityEventController {
    private final SecurityEventService securityEventService;

    @PostMapping
    public ResponseEntity<SecurityEvent> saveSecurityEvent(@RequestBody SecurityEvent event) {
        return ResponseEntity.ok(securityEventService.saveSecurityEvent(event));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<SecurityEvent>> getEventsByType(@PathVariable String type) {
        return ResponseEntity.ok(securityEventService.getEventsByType(type));
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<SecurityEvent>> getEventsBySeverity(@PathVariable String severity) {
        return ResponseEntity.ok(securityEventService.getEventsBySeverity(severity));
    }
    
    @GetMapping("/critical")
    public ResponseEntity<List<SecurityEvent>> getCriticalEvents() {
        return ResponseEntity.ok(securityEventService.getCriticalEvents());
    }
}