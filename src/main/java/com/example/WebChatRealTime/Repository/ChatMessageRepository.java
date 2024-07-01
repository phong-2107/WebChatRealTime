package com.example.WebChatRealTime.Repository;

import com.example.WebChatRealTime.Entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByChatId(String chatId);
}
