package com.ielts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class IeltsPrepApplication {
    public static void main(String[] args) {
        SpringApplication.run(IeltsPrepApplication.class, args);
    }
}


