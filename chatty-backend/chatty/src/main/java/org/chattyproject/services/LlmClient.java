package org.chattyproject.services;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface LlmClient {

    String generateReply(List<Map<String, String>> messages);

    String generateTitle(String firstMessage);
}
