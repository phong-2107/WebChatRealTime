package com.example.WebChatRealTime.Service;


import com.example.WebChatRealTime.Entity.*;
import com.example.WebChatRealTime.Repository.ChatGroupRepository;
import com.example.WebChatRealTime.Repository.ChatRoomRepository;
import com.example.WebChatRealTime.Repository.GroupMemberRepository;
import com.example.WebChatRealTime.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final ChatGroupRepository chatGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ChatRoomRepository chatRoomRepository;
//    public UserService(UserRepository repository, ChatGroupRepository chatGroupRepository, GroupMemberRepository groupMemberRepository) {
//        this.repository = repository;
//        this.chatGroupRepository = chatGroupRepository;
//        this.groupMemberRepository = groupMemberRepository;
//    }


    public void saveUser(User user) {
        user.setStatus(Status.ONLINE);
        repository.save(user);
    }

    public void disconnect(User user) {
        var storedUser = repository.findById(user.getNickName()).orElse(null);
        if (storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            repository.save(storedUser);
        }
    }

    public List<User> findConnectedUsers() {
        return repository.findAllByStatus(Status.ONLINE);
    }

    public ChatGroup createGroup(ChatGroup chatGroup) {
        ChatGroup savedGroup = chatGroupRepository.save(chatGroup);

        // Add creator as group member with ADMIN role
        GroupMember groupMember = new GroupMember();
        groupMember.setGroupId(savedGroup.getId());
        groupMember.setUserId(chatGroup.getCreatorId());
        groupMember.setRole("ADMIN");
        groupMemberRepository.save(groupMember);

        // Create chat room for the group
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setChatId(savedGroup.getId());
        chatRoom.setSenderId(chatGroup.getCreatorId());
        chatRoom.setRecipientId(null);
        chatRoomRepository.save(chatRoom);

        return savedGroup;
    }
    public GroupMember addUserToGroup(String groupId, String userId, String role) {
        GroupMember groupMember = new GroupMember();
        groupMember.setGroupId(groupId);
        groupMember.setUserId(userId);
        groupMember.setRole(role);
        return groupMemberRepository.save(groupMember);
    }

    public void removeUserFromGroup(String groupId, String userId) {
        groupMemberRepository.deleteByGroupIdAndUserId(groupId, userId);
    }

    public List<GroupMember> getGroupMembers(String groupId) {
        return groupMemberRepository.findByGroupId(groupId);
    }

    public List<ChatGroup> getAllGroups() {
        return chatGroupRepository.findAll();
    }
}
