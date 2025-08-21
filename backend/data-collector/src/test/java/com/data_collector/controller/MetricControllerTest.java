package com.data_collector.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.data_collector.model.Metric;
import com.data_collector.service.MetricService;
import com.data_collector.service.RabbitMQService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(MetricController.class)
class MetricControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private RabbitMQService rabbitMQService;

    @MockitoBean
    private MetricService metricService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void postMetric_savesAndPublishes() throws Exception {
        Metric req = new Metric();
        req.setMetricId("m1");
        req.setService("svc");
        Metric saved = new Metric();
        saved.setId("db-1");
        saved.setMetricId(req.getMetricId());
        saved.setService(req.getService());

        Mockito.when(metricService.saveMetric(any(Metric.class))).thenReturn(saved);

        mvc.perform(post("/api/metrics")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("db-1"))
            .andExpect(jsonPath("$.service").value("svc"));

        Mockito.verify(rabbitMQService).sendMetricsToQueue(saved);
    }

    @Test
    void getHighCpu_callsService_withThreshold() throws Exception {
        Mockito.when(metricService.getHighCpuMetrics(0.8)).thenReturn(List.of());
        mvc.perform(get("/api/metrics/high-cpu")
                .param("threshold", "0.8"))
            .andExpect(status().isOk());
        Mockito.verify(metricService).getHighCpuMetrics(0.8);
    }
}
