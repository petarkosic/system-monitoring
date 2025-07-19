package com.rule_engine.service;

import com.rule_engine.dto.AlertMessage;
import com.rule_engine.dto.Metric;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class MetricsRuleService {
    
    private final AlertService alertService;
    private final Map<String, Integer> baseMemory = Map.of(
        "user-service", 1024,
        "redis-cache", 2048,
        "inventory-service", 1536,
        "api-gateway", 2048
    );
    
    public MetricsRuleService(AlertService alertService) {
        this.alertService = alertService;
    }
    
    @RabbitListener(queues = "metrics-queue")
    public void processMetric(Metric metric) {
        if (isHighMemoryUsage(metric)) {
            alertService.sendAlert(new AlertMessage(
                "HIGH_MEMORY_USAGE",
                "High memory usage detected for " + metric.getService(),
                metric
            ));
        }
        
        if (isHighCpuUsage(metric)) {
            alertService.sendAlert(new AlertMessage(
                "HIGH_CPU_USAGE",
                "High CPU usage detected for " + metric.getService(),
                metric
            ));
        }
    }
    
    private boolean isHighMemoryUsage(Metric metric) {
        Integer base = baseMemory.get(metric.getService());
        if (base == null) return false;
        
        double currentMemory = "GB".equals(metric.getMemoryUnits()) ? 
            metric.getMemory() * 1024 : metric.getMemory();
        
        return currentMemory > (base * 1.5);
    }
    
    private boolean isHighCpuUsage(Metric metric) {
        return metric.getCpu() > 80;
    }
}