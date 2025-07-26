package com.alert_manager.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.alert_manager.model.Alert;

public interface AlertRepository extends MongoRepository<Alert, String> {
    List<Alert> findByStatus(Alert.AlertStatus status);
    List<Alert> findByAssignedTo(String assignedTo);
}
