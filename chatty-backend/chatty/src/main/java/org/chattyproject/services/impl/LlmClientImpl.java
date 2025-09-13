package org.chattyproject.services.impl;

import org.chattyproject.config.LlmConfig;
import org.chattyproject.services.LlmClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class LlmClientImpl implements LlmClient {

    private final LlmConfig config;

    @Autowired
    public LlmClientImpl(LlmConfig config) {
        this.config = config;
    }

    private WebClient getWebClient() {
        return WebClient.builder()
                .baseUrl(config.getLlmApiBaseUrl())
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + config.getLlmApiKey())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public String generateReply(List<Map<String, String>> messages) {
        Map<String, Object> request = Map.of(
                "model", config.getLlmModel(),
                "messages", messages
        );

        Map response = getWebClient().post()
                .uri("/chat/completions")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return (String) ((Map) ((Map) ((List) response.get("choices")).get(0)).get("message")).get("content");
    }

    @Override
    public String generateTitle(String firstMessage) {
        String prompt = "You are a useful assistant. Generate a short descriptive chat title for this user message: " + firstMessage;
        return generateReply(List.of(Map.of("role","user" ,"content", prompt)));
    }
}
