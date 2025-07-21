package com.data_collector.config;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class RabbitConfig {

    private static final String LOG_QUEUE = "log-queue";
    private static final String METRICS_QUEUE = "metrics-queue";
    private static final String SECURITY_EVENT_QUEUE = "security-event-queue";
    private static final String EXCHANGE = "data-collector-exchange";

    @Bean
    public Queue logQueue() {
        return new Queue(LOG_QUEUE, true);
    }

    @Bean
    public Queue metricQueue() {
        return new Queue(METRICS_QUEUE, true);
    }

    @Bean
    public Queue securityEventQueue() {
        return new Queue(SECURITY_EVENT_QUEUE, true);
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE, true, false);
    }

    @Bean
    public Binding bindLogQueue(Queue logQueue, DirectExchange exchange) {
        return BindingBuilder.bind(logQueue).to(exchange).with(LOG_QUEUE);
    }

    @Bean
    public Binding bindMetricQueue(Queue metricQueue, DirectExchange exchange) {
        return BindingBuilder.bind(metricQueue).to(exchange).with(METRICS_QUEUE);
    }

    @Bean
    public Binding bindSecurityEventQueue(Queue securityEventQueue, DirectExchange exchange) {
        return BindingBuilder.bind(securityEventQueue).to(exchange).with(SECURITY_EVENT_QUEUE);
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return new Jackson2JsonMessageConverter(mapper);
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory, Jackson2JsonMessageConverter converter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(converter);
        return rabbitTemplate;
    }   
}
