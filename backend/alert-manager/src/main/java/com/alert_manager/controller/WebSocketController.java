package com.alert_manager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebSocketController {
    @GetMapping("/alerts-dashboard")
    public String alertsDashboard() {
        return "alerts-dashboard";
    }
}
