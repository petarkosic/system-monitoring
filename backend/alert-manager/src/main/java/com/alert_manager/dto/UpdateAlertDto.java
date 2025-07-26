package com.alert_manager.dto;

import com.alert_manager.model.Alert.AlertStatus;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Data
public class UpdateAlertDto {
    @NotNull
    private AlertStatus status;
    private String assignedTo;
    private String resolutionNotes;
}