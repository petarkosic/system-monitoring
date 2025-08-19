package com.rule_engine.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.rule_engine.dto.AlertMessage;
import com.rule_engine.dto.Metric;

@Service
public class MetricsRuleService {
    
    private final AlertService alertService;
    
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
        return metric.getMemory() > metric.getBaseMemory() * 1.7;
    }
    
    private boolean isHighCpuUsage(Metric metric) {
        return metric.getCpu() > 75;
    }
}