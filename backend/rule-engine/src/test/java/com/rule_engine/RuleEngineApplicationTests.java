package com.rule_engine;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.rabbitmq.client.ConnectionFactory;

@SpringBootTest
class RuleEngineApplicationTests {

	@MockitoBean
	private ConnectionFactory connectionFactory;

	@MockitoBean
	private RabbitAdmin rabbitAdmin;

	@Test
	void contextLoads() {
	}

}
