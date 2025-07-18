package com.rule_engine.config;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    
    private static final String LOG_QUEUE = "log-queue";
    private static final String METRICS_QUEUE = "metrics-queue";
    private static final String SECURITY_EVENT_QUEUE = "security-event-queue";
    private static final String ALERT_QUEUE = "alert-queue";
    private static final String EXCHANGE = "data-collector-exchange";


    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE, true, false);
    }

    @Bean
    public Queue logQueue() {
        return new Queue(LOG_QUEUE, true);
    }
    
    @Bean
    public Queue metricsQueue() {
        return new Queue(METRICS_QUEUE, true);
    }
    
    @Bean
    public Queue securityEventQueue() {
        return new Queue(SECURITY_EVENT_QUEUE, true);
    }
    
    @Bean
    public Queue alertQueue() {
        return new Queue(ALERT_QUEUE, true);
    }
    
    @Bean
    public Binding logBinding() {
        return BindingBuilder.bind(logQueue()).to(exchange()).with(LOG_QUEUE);
    }
    
    @Bean
    public Binding metricsBinding() {
        return BindingBuilder.bind(metricsQueue()).to(exchange()).with(METRICS_QUEUE);
    }
    
    @Bean
    public Binding securityBinding() {
        return BindingBuilder.bind(securityEventQueue()).to(exchange()).with(SECURITY_EVENT_QUEUE);
    }

    @Bean
    public Binding alertBinding() {
        return BindingBuilder.bind(alertQueue()).to(exchange()).with(ALERT_QUEUE);
    }

    @Bean
    public MessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(converter());
        return rabbitTemplate;
    }
}
