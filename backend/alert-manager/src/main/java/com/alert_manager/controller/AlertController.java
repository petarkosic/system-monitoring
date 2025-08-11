package com.alert_manager.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alert_manager.dto.UpdateAlertDto;
import com.alert_manager.model.Alert;
import com.alert_manager.service.AlertService;


@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins ="http://localhost:3000")
public class AlertController {
    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<Alert> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    @PutMapping("/{id}")
    public Alert updateAlert(@PathVariable String id, @RequestBody UpdateAlertDto updateAlertDto) {
        return alertService.updateAlert(id, updateAlertDto);
    }

    @GetMapping("/{id}")
    public Alert getAlertById(@PathVariable String id) {
        return alertService.getAlertById(id);
    }

    @PatchMapping("/{id}")
    public Alert updateNote(@PathVariable String id, @RequestBody String note) {
        return alertService.updateNote(id, note);
    }
}
