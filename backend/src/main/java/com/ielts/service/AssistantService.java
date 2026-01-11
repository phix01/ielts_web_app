package com.ielts.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

@Service
public class AssistantService {
    private static final Logger logger = LoggerFactory.getLogger(AssistantService.class);

    @Value("${hf.api.key:}")
    private String hfApiKey;

    @Autowired
    private Environment environment;

    // Short system prompt that instructs the model to only answer app-related questions
    private static final String SYSTEM_PROMPT = "You are an assistant for the IELTS Prep web application. Only answer questions about how to use the app and the app's features (notes, tests, readings, listening, navigation). If the user asks something unrelated to the app, politely say you can only help with app usage and suggest they consult external resources. Keep answers short and factual. Do not hallucinate features or claim the app does things it does not.";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    private String resolveHfKey() {
        // 1) Prefer Spring-injected property (hf.api.key)
        if (hfApiKey != null && !hfApiKey.isBlank()) return hfApiKey;
        // 2) Check Spring Environment for HF_API_KEY or hf.api.key
        if (environment != null) {
            String envFromSpring = environment.getProperty("HF_API_KEY");
            if (envFromSpring != null && !envFromSpring.isBlank()) return envFromSpring;
            String prop = environment.getProperty("hf.api.key");
            if (prop != null && !prop.isBlank()) return prop;
        }
        // 3) Fallback to real OS environment variable
        String env = System.getenv("HF_API_KEY");
        return (env != null && !env.isBlank()) ? env : "";
    }

    @javax.annotation.PostConstruct
    private void init() {
        String key = resolveHfKey();
        boolean configured = key != null && !key.isBlank();
        if (!configured) {
            logger.info("Assistant configured: false (HF_API_KEY not found)");
        } else {
            logger.info("Assistant configured: true (HF_API_KEY found)");
        }
    }

    public boolean isConfigured() {
        String key = resolveHfKey();
        return key != null && !key.isBlank();
    }

    public String chat(String userMessage) {
        if (!isConfigured()) {
            logger.warn("Hugging Face key not configured");
            throw new IllegalStateException("Assistant not configured");
        }

        logger.info("Assistant chat invoked; messageLen={}", userMessage == null ? 0 : userMessage.length());

        try {
            String url = "https://router.huggingface.co/models/tiiuae/falcon-7b-instruct";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            String apiKey = resolveHfKey();
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("inputs", userMessage);

            HttpEntity<String> req = new HttpEntity<>(mapper.writeValueAsString(body), headers);

            // Simple retry logic for transient upstream failures (429 or 5xx)
            int attempts = 0;
            int maxAttempts = 3;
            long backoffMs = 500;

            while (true) {
                attempts++;
                logger.debug("Calling Hugging Face Inference API (attempt {}): url={} inputLen={}", attempts, url, userMessage == null ? 0 : userMessage.length());
                try {
                    ResponseEntity<String> res = restTemplate.postForEntity(url, req, String.class);
                    String bodyStr = res.getBody();
                    // Log the full status and raw body for debugging
                    logger.info("Hugging Face response status={} body={}", res.getStatusCodeValue(), bodyStr == null ? "" : bodyStr);

                    if (res.getStatusCode().is2xxSuccessful() && bodyStr != null) {
                        // HF usually returns an array of { generated_text: "..." }
                        JsonNode root = mapper.readTree(bodyStr);
                        if (root.isArray() && root.size() > 0) {
                            JsonNode first = root.get(0);
                            if (first.has("generated_text")) {
                                return first.get("generated_text").asText().trim();
                            }
                            // Some models return 'generated_text' under different keys
                            if (first.has("text")) return first.get("text").asText().trim();

                            // If first element is a plain string (unexpected), return it
                            if (first.isTextual()) return first.asText().trim();
                        }

                        // If it's an object with generated_text directly
                        if (root.has("generated_text")) return root.get("generated_text").asText().trim();

                        // If it's a plain string or unexpected shape, return raw body as a last resort
                        String raw = bodyStr.trim();
                        if (!raw.isEmpty()) return raw;

                        logger.warn("Hugging Face returned unexpected shape: {}", bodyStr);
                        return "Assistant is currently unavailable (unexpected response from LLM).";
                    } else {
                        // Non-2xx: handle model-loading (503) explicitly
                        int status = res.getStatusCodeValue();
                        String lower = (bodyStr == null) ? "" : bodyStr.toLowerCase();
                        if (status == 503 || lower.contains("loading") || lower.contains("model is loading")) {
                            logger.info("Hugging Face model is loading; status={} body={}", status, bodyStr);
                            return "Assistant is warming up, please try again in a few seconds.";
                        }

                        // Retry for transient 429 or 5xx
                        if ((status == 429 || (status >= 500 && status < 600)) && attempts < maxAttempts) {
                            logger.warn("Transient HF response (status={}), will retry after backoff {}ms", status, backoffMs);
                            try { Thread.sleep(backoffMs); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                            backoffMs *= 2;
                            continue;
                        }

                        // For other statuses, return a helpful message to the user
                        logger.error("Hugging Face non-2xx response: {} - body: {}", res.getStatusCode(), bodyStr);
                        return "Assistant is currently unavailable (upstream error: " + res.getStatusCodeValue() + ").";
                    }
                } catch (org.springframework.web.client.HttpStatusCodeException hce) {
                    String respBody = hce.getResponseBodyAsString();
                    int status = hce.getStatusCode().value();
                    // Log full status and raw body
                    logger.error("Hugging Face request failed: status={} body={}", status, respBody);
                    logger.error("Assistant chat failed", hce);
                    // If model is loading, return a friendly message instead of throwing
                    String lower = (respBody == null) ? "" : respBody.toLowerCase();
                    if (status == 503 || lower.contains("loading") || lower.contains("model is loading")) {
                        logger.info("Hugging Face model is loading (status={}): {}", status, respBody);
                        return "Assistant is warming up, please try again in a few seconds.";
                    }

                    // Retry transient errors
                    if ((status == 429 || (status >= 500 && status < 600)) && attempts < maxAttempts) {
                        logger.warn("Transient HF http error (status={}), will retry after backoff {}ms", status, backoffMs);
                        try { Thread.sleep(backoffMs); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                        backoffMs *= 2;
                        continue;
                    }

                    // For non-transient errors like 401/403/410, return a helpful message
                    return "Assistant is currently unavailable (upstream error: " + status + ").";
                }
            }
        } catch (Exception e) {
            logger.error("Assistant chat failed", e);
            // Return a generic friendly message instead of propagating a 500 runtime exception
            return "Assistant is currently unavailable due to an internal error. Please try again later.";
        }
    }
}
