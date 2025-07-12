package com.data_collector.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.data_collector.model.LogEntry;
import com.data_collector.model.Metric;
import com.data_collector.model.SecurityEvent;

@Service
public class RabbitMQService {
    private final RabbitTemplate rabbitTemplate;

    private String logQueue;
    private String metricsQueue;
    private String securityEventQueue;

    public RabbitMQService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendLogToQueue(LogEntry logEntry) {
        rabbitTemplate.convertAndSend(logQueue, logEntry);
    }

    public void sendMetricsToQueue(Metric metricEntry) {
        rabbitTemplate.convertAndSend(metricsQueue, metricEntry);
    }

    public void sendSecurityEventToQueue(SecurityEvent secyrityEventEntry) {
        rabbitTemplate.convertAndSend(securityEventQueue, secyrityEventEntry);
    }
}
