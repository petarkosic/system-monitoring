package com.alert_manager.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.alert_manager.dto.AlertDto;
import com.alert_manager.dto.UpdateAlertDto;
import com.alert_manager.model.Alert;
import com.alert_manager.repository.AlertRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlertService {
    private final AlertRepository alertRepository;
    private final WebSocketService webSocketService;

    @RabbitListener(queues = "alert-queue")
    public void handleAlert(AlertDto alertDto) {
        Map<String, Object> payload = alertDto.getPayload();

        Alert alert = new Alert();
        alert.setRuleType(alertDto.getRuleType());
        alert.setMessage(alertDto.getMessage());
        alert.setService(payload.getOrDefault("service", "unknown").toString());
        alert.setSeverity(payload.getOrDefault("severity", "medium").toString());
        alert.setPayload(payload);

        Alert savedAlert = alertRepository.save(alert);
        webSocketService.sendAlert(savedAlert);
    }

    public Alert getAlertById(String id) {
        return alertRepository.findById(id).orElseThrow(() -> new RuntimeException("Alert with id " + id + " not found"));
    }

    public Alert updateAlert(String id, UpdateAlertDto updateAlertDto) {
        return alertRepository.findById(id).map(alert -> {
            alert.setStatus(updateAlertDto.getStatus());
            alert.setAssignedTo(updateAlertDto.getAssignedTo());
            alert.setResolutionNotes(updateAlertDto.getResolutionNotes());
            alert.setUpdatedAt(new Date());

            Alert updatedAlert = alertRepository.save(alert);
            webSocketService.sendAlert(updatedAlert);

            return updatedAlert;
        }).orElseThrow(() -> new RuntimeException("Alert with id " + id + " not found"));
    }

    public List<Alert> getOpenAlerts() {
        return alertRepository.findByStatus(Alert.AlertStatus.OPEN);
    }
}
