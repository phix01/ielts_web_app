package com.ielts.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${mail.from:no-reply@example.com}")
    private String mailFrom;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            // If no SMTP username configured, treat as dev mode: log the message instead of sending
            if (mailUsername == null || mailUsername.trim().isEmpty()) {
                logger.info("DEV EMAIL (not sent) - to={} subject={}\n---BEGIN DEV EMAIL---\n{}\n---END DEV EMAIL---", to, subject, text);
                return;
            }
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            // Log and rethrow or swallow depending on severity
            logger.error("Failed to send email: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to send email");
        }
    }
}
