package com.data_collector.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import com.data_collector.model.LogEntry;
import com.data_collector.model.Metric;
import com.data_collector.model.SecurityEvent;

class RabbitMQServiceTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    private RabbitMQService rabbitMQService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        rabbitMQService = new RabbitMQService(rabbitTemplate);
    }

    @Test
    void sendLogToQueue_callsRabbitTemplate() {
        LogEntry e = new LogEntry();
        e.setLogId("l1");
        rabbitMQService.sendLogToQueue(e);

        ArgumentCaptor<Object> captor = ArgumentCaptor.forClass(Object.class);
        verify(rabbitTemplate).convertAndSend(eq("log-queue"), captor.capture());
        assertThat(captor.getValue()).isEqualTo(e);
    }

    @Test
    void sendMetricsToQueue_callsRabbitTemplate() {
        Metric m = new Metric();
        m.setMetricId("m1");
        rabbitMQService.sendMetricsToQueue(m);
        verify(rabbitTemplate).convertAndSend(eq("metrics-queue"), eq(m));
    }

    @Test
    void sendSecurityEventToQueue_callsRabbitTemplate() {
        SecurityEvent s = new SecurityEvent();
        s.setEventId("ev1");
        rabbitMQService.sendSecurityEventToQueue(s);
        verify(rabbitTemplate).convertAndSend(eq("security-event-queue"), eq(s));
    }
}
