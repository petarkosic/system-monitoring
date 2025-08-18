package com.data_collector.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.data_collector.model.SecurityEvent;
import com.data_collector.service.RabbitMQService;
import com.data_collector.service.SecurityEventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/security-events")
@RequiredArgsConstructor
public class SecurityEventController {

    private final RabbitMQService rabbitMQService;
    private final SecurityEventService securityEventService;

    @PostMapping
    public ResponseEntity<SecurityEvent> saveSecurityEvent(@RequestBody SecurityEvent event) {
        SecurityEvent savedEvent = securityEventService.saveSecurityEvent(event);
        rabbitMQService.sendSecurityEventToQueue(savedEvent);

        return ResponseEntity.ok(savedEvent);
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