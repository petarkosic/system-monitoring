package com.rule_engine.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.rule_engine.dto.AlertMessage;
import com.rule_engine.dto.LogEntry;

class LogRuleServiceTest {

    @Test
    void processLog_sendsAlert_when_level_is_error() {
        AlertService alertService = mock(AlertService.class);
        LogRuleService service = new LogRuleService(alertService);

        LogEntry log = new LogEntry();
        log.setLevel("ERROR");
        log.setType("EXCEPTION");
        log.setService("my-service");

        service.processLog(log);

        ArgumentCaptor<AlertMessage> captor = ArgumentCaptor.forClass(AlertMessage.class);
        verify(alertService, times(1)).sendAlert(captor.capture());

        AlertMessage sent = captor.getValue();
        assertEquals("EXCEPTION", sent.getRuleType());
        assertTrue(sent.getMessage().contains("Error log detected"));
        assertSame(log, sent.getPayload());
    }

    @Test
    void processLog_doesNotSendAlert_when_level_is_not_error() {
        AlertService alertService = mock(AlertService.class);
        LogRuleService service = new LogRuleService(alertService);

        LogEntry log = new LogEntry();
        log.setLevel("INFO");
        log.setType("INFO_TYPE");
        log.setService("my-service");

        service.processLog(log);

        verify(alertService, never()).sendAlert(any());
    }
}
