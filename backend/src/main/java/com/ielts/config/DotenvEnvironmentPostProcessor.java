package com.ielts.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {
    private static final String[] CANDIDATE_DIRS = new String[]{
            ".",
            "backend",
            "ielts-prep-web/backend",
            "./",
            "./backend",
            "./ielts-prep-web/backend"
    };

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        for (String dir : CANDIDATE_DIRS) {
            try {
                Dotenv dotenv = Dotenv.configure().directory(dir).ignoreIfMissing().load();
                String hfKey = dotenv.get("HF_API_KEY");
                String assistantKey = dotenv.get("ASSISTANT_OPENAI_KEY");
                if (hfKey != null && !hfKey.isBlank()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("HF_API_KEY", hfKey);
                    // Also add a common property name for spring binding
                    map.put("hf.api.key", hfKey);
                    environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", map));

                    // Log for visibility
                    System.out.println("Loaded HF_API_KEY from .env directory: " + dir);

                    // Best-effort: set into OS environment map so System.getenv would see it (may fail on some platforms)
                    try {
                        setEnv("HF_API_KEY", hfKey);
                    } catch (Exception ignored) {
                        // ignore failures to patch System.getenv
                    }

                    // Done, we found a key; stop searching
                    return;
                }

                // Backwards-compatible: if ASSISTANT_OPENAI_KEY is present, map it to HF_API_KEY
                if (assistantKey != null && !assistantKey.isBlank()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("HF_API_KEY", assistantKey);
                    map.put("hf.api.key", assistantKey);
                    environment.getPropertySources().addFirst(new MapPropertySource("dotenvProperties", map));

                    System.out.println("Loaded ASSISTANT_OPENAI_KEY from .env directory and mapped to HF_API_KEY: " + dir);
                    try {
                        setEnv("HF_API_KEY", assistantKey);
                    } catch (Exception ignored) {
                    }
                    return;
                }
            } catch (Exception e) {
                // ignore and continue
            }
        }
    }

    // Reflection-based attempt to inject into the unmodifiable System.getenv map
    @SuppressWarnings({"unchecked", "rawtypes"})
    private static void setEnv(String key, String value) throws Exception {
        try {
            Map<String, String> env = System.getenv();
            Class<?> cl = env.getClass();
            Field field = cl.getDeclaredField("m");
            field.setAccessible(true);
            Map<String, String> writableEnv = (Map<String, String>) field.get(env);
            writableEnv.put(key, value);
        } catch (NoSuchFieldException nsfe) {
            // fallback for other JVMs (Windows)
            Class<?> processEnvironment = Class.forName("java.lang.ProcessEnvironment");
            try {
                Field theCaseInsensitiveEnvironment = processEnvironment.getDeclaredField("theCaseInsensitiveEnvironment");
                theCaseInsensitiveEnvironment.setAccessible(true);
                Map<String, String> cienv = (Map<String, String>) theCaseInsensitiveEnvironment.get(null);
                cienv.put(key, value);
            } catch (NoSuchFieldException ex) {
                throw nsfe;
            }
        }
    }
}
