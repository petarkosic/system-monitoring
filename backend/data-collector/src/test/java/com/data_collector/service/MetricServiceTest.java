package com.data_collector.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.data_collector.model.Metric;
import com.data_collector.repository.MetricRepository;

class MetricServiceTest {

    @Mock
    private MetricRepository metricRepository;

    @InjectMocks
    private MetricService metricService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveMetric_callsRepository() {
        Metric in = new Metric();
        in.setMetricId("m1");
        Metric saved = new Metric();
        saved.setId("db-1");
        when(metricRepository.save(in)).thenReturn(saved);

        var out = metricService.saveMetric(in);
        assertThat(out).isSameAs(saved);
        verify(metricRepository).save(in);
    }

    @Test
    void getHighCpuMetrics_callsRepoWithThreshold() {
        when(metricRepository.findByCpuGreaterThan(0.9)).thenReturn(List.of());
        var res = metricService.getHighCpuMetrics(0.9);
        assertThat(res).isEmpty();
        verify(metricRepository).findByCpuGreaterThan(0.9);
    }
}
