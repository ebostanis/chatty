package org.chattyproject.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LlmConfig {

    @Value("${llm.api.key}")
    private String llmApiKey;

    @Value("${llm.api.base-url}")
    private String llmApiBaseUrl;

    @Value("${llm.model}")
    private String llmModel;

    public String getLlmApiKey() {
        return llmApiKey;
    }

    public String getLlmApiBaseUrl() {
        return llmApiBaseUrl;
    }

    public String getLlmModel() {
        return llmModel;
    }
}
