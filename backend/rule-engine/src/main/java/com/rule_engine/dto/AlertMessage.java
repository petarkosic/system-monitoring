package com.rule_engine.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlertMessage {
    private String ruleType;
    private String message;
    private Object payload;
}