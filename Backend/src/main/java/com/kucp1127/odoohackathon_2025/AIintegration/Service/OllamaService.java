package com.kucp1127.odoohackathon_2025.AIintegration.Service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.stereotype.Service;

@Service
public class OllamaService {

    private ChatClient chatClient;

    public OllamaService(OllamaChatModel chatModel) {
        this.chatClient = ChatClient.create(chatModel);
    }

    public String getAnswer(String message) {

        ChatResponse chatResponse = chatClient
                .prompt(message)
                .call()
                .chatResponse();

        String response = chatResponse
                .getResult()
                .getOutput()
                .getText();

        response = response.replaceAll("(?s)<think>.*?</think>\\s*", "");
        return response;
    }
}