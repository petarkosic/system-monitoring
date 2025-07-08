package com.data_collector.controller;

import com.data_collector.model.Metric;
import com.data_collector.service.MetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricController {
    private final MetricService metricService;

    @PostMapping
    public ResponseEntity<Metric> saveMetric(@RequestBody Metric metric) {
        return ResponseEntity.ok(metricService.saveMetric(metric));
    }

    @GetMapping("/service/{service}")
    public ResponseEntity<List<Metric>> getMetricsByService(@PathVariable String service) {
        return ResponseEntity.ok(metricService.getMetricsByService(service));
    }

    @GetMapping("/high-cpu")
    public ResponseEntity<List<Metric>> getHighCpuMetrics(@RequestParam Double threshold) {
        return ResponseEntity.ok(metricService.getHighCpuMetrics(threshold));
    }

    @GetMapping("/high-memory")
    public ResponseEntity<List<Metric>> getHighMemoryMetrics(@RequestParam Double threshold) {
        return ResponseEntity.ok(metricService.getHighMemoryMetrics(threshold));
    }
}