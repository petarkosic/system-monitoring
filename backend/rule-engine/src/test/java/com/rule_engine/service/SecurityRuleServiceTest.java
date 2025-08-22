package com.rule_engine.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.rule_engine.dto.AlertMessage;
import com.rule_engine.dto.SecurityEvent;

class SecurityRuleServiceTest {

    @Test
    void processSecurityEvent_sendsAlert_when_threat_and_critical_or_high() {
        AlertService alertService = mock(AlertService.class);
        SecurityRuleService svc = new SecurityRuleService(alertService);

        SecurityEvent e = new SecurityEvent();
        e.setType("threat");
        e.setSeverity("critical");
        e.setService("auth-service");

        svc.processSecurityEvent(e);

        ArgumentCaptor<AlertMessage> cap = ArgumentCaptor.forClass(AlertMessage.class);
        verify(alertService).sendAlert(cap.capture());

        AlertMessage msg = cap.getValue();
        assertEquals("CRITICAL_SECURITY_THREAT", msg.getRuleType());
        assertTrue(msg.getMessage().contains("Critical security threat"));
        assertSame(e, msg.getPayload());
    }

    @Test
    void processSecurityEvent_doesNotSendAlert_when_not_threat_or_low_severity() {
        AlertService alertService = mock(AlertService.class);
        SecurityRuleService svc = new SecurityRuleService(alertService);

        SecurityEvent e1 = new SecurityEvent();
        e1.setType("info");
        e1.setSeverity("low");
        e1.setService("svc");
        svc.processSecurityEvent(e1);

        SecurityEvent e2 = new SecurityEvent();
        e2.setType("threat");
        e2.setSeverity("medium");
        e2.setService("svc");
        svc.processSecurityEvent(e2);

        verify(alertService, never()).sendAlert(any());
    }
}
