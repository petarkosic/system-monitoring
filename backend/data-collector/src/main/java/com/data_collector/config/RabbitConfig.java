package com.data_collector.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    private static final String LOG_QUEUE = "log-queue";
    private static final String METRICS_QUEUE = "metrics-queue";
    private static final String SECURITY_EVENT_QUEUE = "security-event-queue";
    private static final String EXCHANGE = "data-collector-exchange";

    @Bean
    public Queue logQueue() {
        return new Queue(LOG_QUEUE, true, false, false);
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
}
