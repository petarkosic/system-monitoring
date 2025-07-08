package com.data_collector.service;

import com.data_collector.model.Metric;
import com.data_collector.repository.MetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MetricService {
    private final MetricRepository metricRepository;

    public Metric saveMetric(Metric metric) {
        return metricRepository.save(metric);
    }

    public List<Metric> getMetricsByService(String service) {
        return metricRepository.findByService(service);
    }

    public List<Metric> getMetricsByTimeRange(Instant start, Instant end) {
        return metricRepository.findByTimestampBetween(start, end);
    }

    public List<Metric> getHighCpuMetrics(Double threshold) {
        return metricRepository.findByCpuGreaterThan(threshold);
    }

    public List<Metric> getHighMemoryMetrics(Double threshold) {
        return metricRepository.findByMemoryGreaterThan(threshold);
    }
}