package com.data_collector.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.data_collector.model.Metric;
import com.data_collector.service.MetricService;
import com.data_collector.service.RabbitMQService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricController {

    private final RabbitMQService rabbitMQService;
    private final MetricService metricService;

    @PostMapping
    public ResponseEntity<Metric> saveMetric(@RequestBody Metric metric) {
        rabbitMQService.sendMetricsToQueue(metric);

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