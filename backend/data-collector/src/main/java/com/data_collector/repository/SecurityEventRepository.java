package com.data_collector.repository;

import com.data_collector.model.SecurityEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface SecurityEventRepository extends MongoRepository<SecurityEvent, String> {
    List<SecurityEvent> findByType(String type);
    List<SecurityEvent> findBySeverity(String severity);
    List<SecurityEvent> findByTimestampBetween(Instant start, Instant end);
    List<SecurityEvent> findByTypeAndSeverity(String type, String severity);
}