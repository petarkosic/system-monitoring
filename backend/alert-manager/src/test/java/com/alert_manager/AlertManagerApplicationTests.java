package com.alert_manager;

import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.mongodb.client.MongoClient;
import com.rabbitmq.client.ConnectionFactory;

@SpringBootTest
class AlertManagerApplicationTests {

	@MockitoBean
	private ConnectionFactory connectionFactory;

	@MockitoBean
	private RabbitAdmin rabbitAdmin;
	
	@MockitoBean
	private MongoClient mongoClient;
	
	@Test
	void contextLoads() {
	}

}
