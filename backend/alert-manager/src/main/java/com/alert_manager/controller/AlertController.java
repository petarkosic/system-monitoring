package com.alert_manager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alert_manager.dto.UpdateAlertDto;
import com.alert_manager.model.Alert;
import com.alert_manager.service.AlertService;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {
    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<Alert> getOpenAlerts() {
        return alertService.getOpenAlerts();
    }

    @PutMapping("/{id}")
    public Alert updateAlert(@PathVariable String id, UpdateAlertDto updateAlertDto) {
        return alertService.updateAlert(id, updateAlertDto);
    }

    @GetMapping("/{id}")
    public Alert getAlertById(@PathVariable String id) {
        return alertService.getAlertById(id);
    }
}
