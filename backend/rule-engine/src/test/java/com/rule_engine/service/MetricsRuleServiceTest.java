package com.rule_engine.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.rule_engine.dto.AlertMessage;
import com.rule_engine.dto.Metric;

class MetricsRuleServiceTest {

    @Test
    void processMetric_sendsMemoryAndCpuAlerts_when_both_thresholds_exceeded() {
        AlertService alertService = mock(AlertService.class);
        MetricsRuleService svc = new MetricsRuleService(alertService);

        Metric m = new Metric();
        m.setService("svcA");
        m.setBaseMemory(1000);   // base
        m.setMemory(2000);       // 2000 > 1000 * 1.7 => true
        m.setCpu(80);            // 80 > 75 => true

        svc.processMetric(m);

        // expect 2 alerts: memory + cpu
        verify(alertService, times(2)).sendAlert(any(AlertMessage.class));

        ArgumentCaptor<AlertMessage> cap = ArgumentCaptor.forClass(AlertMessage.class);
        verify(alertService, times(2)).sendAlert(cap.capture());

        boolean foundMemory = cap.getAllValues().stream()
            .anyMatch(a -> a.getRuleType().contains("HIGH") && a.getMessage().contains("High memory"));
        boolean foundCpu = cap.getAllValues().stream()
            .anyMatch(a -> a.getRuleType().contains("HIGH") && a.getMessage().contains("CPU"));
        assertTrue(foundMemory, "Memory alert not sent");
        assertTrue(foundCpu, "CPU alert not sent");
    }

    @Test
    void processMetric_sendsOnlyCpuAlert_when_memory_ok_but_cpu_high() {
        AlertService alertService = mock(AlertService.class);
        MetricsRuleService svc = new MetricsRuleService(alertService);

        Metric m = new Metric();
        m.setService("svcB");
        m.setBaseMemory(1000);
        m.setMemory(1500); // 1500 <= 1700 -> no memory alert
        m.setCpu(90);      // cpu alert

        svc.processMetric(m);

        verify(alertService, times(1)).sendAlert(any(AlertMessage.class));
        ArgumentCaptor<AlertMessage> cap = ArgumentCaptor.forClass(AlertMessage.class);
        verify(alertService).sendAlert(cap.capture());
        assertEquals("HIGH_CPU_USAGE", cap.getValue().getRuleType());
    }
}
