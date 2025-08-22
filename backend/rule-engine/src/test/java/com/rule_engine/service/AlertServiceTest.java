package com.rule_engine.service;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import com.rule_engine.dto.AlertMessage;

class AlertServiceTest {

    @Test
    void sendAlert_delegatesToRabbitTemplate() {
        RabbitTemplate rabbitTemplate = mock(RabbitTemplate.class);
        AlertService service = new AlertService(rabbitTemplate);

        AlertMessage msg = new AlertMessage("MY_RULE", "hello", null);
        service.sendAlert(msg);

        verify(rabbitTemplate).convertAndSend("alert-queue", msg);
    }
}
