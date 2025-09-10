package org.chattyproject.services.impl;

import org.chattyproject.services.LlmClient;
import org.springframework.stereotype.Service;

@Service
public class MockLlmClientImpl implements LlmClient {

    public String generateReply(String prompt) { return "Mock reply to: " + prompt; }
    public String generateTitle(String firstMessage) { return "Mock Chat Title"; }

}
