package com.data_collector.repository;

import com.data_collector.model.Metric;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MetricRepository extends MongoRepository<Metric, String> {
    List<Metric> findByService(String service);
    List<Metric> findByTimestampBetween(Instant start, Instant end);
    List<Metric> findByCpuGreaterThan(Double threshold);
    List<Metric> findByMemoryGreaterThan(Double threshold);
}