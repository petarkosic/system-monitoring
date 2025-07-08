package com.data_collector.service;

import com.data_collector.model.SecurityEvent;
import com.data_collector.repository.SecurityEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SecurityEventService {
    private final SecurityEventRepository securityEventRepository;

    public SecurityEvent saveSecurityEvent(SecurityEvent event) {
        return securityEventRepository.save(event);
    }

    public List<SecurityEvent> getEventsByType(String type) {
        return securityEventRepository.findByType(type);
    }

    public List<SecurityEvent> getEventsBySeverity(String severity) {
        return securityEventRepository.findBySeverity(severity);
    }

    public List<SecurityEvent> getEventsByTimeRange(Instant start, Instant end) {
        return securityEventRepository.findByTimestampBetween(start, end);
    }

    public List<SecurityEvent> getCriticalEvents() {
        return securityEventRepository.findBySeverity("CRITICAL");
    }
}