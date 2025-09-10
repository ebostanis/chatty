package org.chattyproject.services;

import org.springframework.stereotype.Service;

@Service
public interface LlmClient {

    String generateReply(String prompt);

    String generateTitle(String firstMessage);
}
