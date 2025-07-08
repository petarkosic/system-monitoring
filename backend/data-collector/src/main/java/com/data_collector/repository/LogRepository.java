package com.data_collector.repository;

import com.data_collector.model.LogEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface LogRepository extends MongoRepository<LogEntry, String> {
    List<LogEntry> findByService(String service);
    List<LogEntry> findByLevel(String level);
    List<LogEntry> findByTimestampBetween(Instant start, Instant end);
    List<LogEntry> findByServiceAndLevel(String service, String level);
}