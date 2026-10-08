package com.kjandgo.wordthinker.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {
    @GetMapping({"/","/health"})
    public ResponseEntity<?> healthCheck(){
        return ResponseEntity.ok().body("I'm OK");
    }
}
