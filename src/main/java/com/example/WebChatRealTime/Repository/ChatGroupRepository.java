package com.example.WebChatRealTime.Repository;

import com.example.WebChatRealTime.Entity.ChatGroup;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChatGroupRepository extends MongoRepository<ChatGroup, String> {
}