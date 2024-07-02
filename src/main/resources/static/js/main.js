'use strict';

const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const connectingElement = document.querySelector('.connecting');
const chatArea = document.querySelector('#chat-messages');
const logout = document.querySelector('.logout');
var mess
let stompClient = null;
let nickname = null;
let fullname = null;
let selectedUserId = null;

function connect(event) {
    nickname = document.querySelector('#nickname').value.trim();
    fullname = document.querySelector('#fullname').value.trim();
    if (nickname && fullname) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {
    stompClient.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived);
    stompClient.subscribe(`/user/public`, onMessageReceived);

    // register the connected user
    stompClient.send("/app/user.addUser",
        {},
        JSON.stringify({nickName: nickname, fullName: fullname, status: 'ONLINE'})
    );
//    document.querySelector('#connected-user-fullname').textContent = fullname;
    findAndDisplayConnectedUsers().then();
}

async function findAndDisplayConnectedUsers() {
    const connectedUsersResponse = await fetch('/users');
    let connectedUsers = await connectedUsersResponse.json();
    connectedUsers = connectedUsers.filter(user => user.nickName !== nickname);
    const connectedUsersList = document.getElementById('connectedUsers');
    connectedUsersList.innerHTML = '';

    connectedUsers.forEach(user => {
        appendUserElement(user, connectedUsersList);
        if (connectedUsers.indexOf(user) < connectedUsers.length - 1) {
            const separator = document.createElement('li');
            separator.classList.add('separator');
            connectedUsersList.appendChild(separator);
        }
    });
}

function appendUserElement(user, connectedUsersList) {
    const listItem = document.createElement('li');
        listItem.classList.add('user-item');
        listItem.id = user.nickName;

        const anchorTag = document.createElement('a');
//        anchorTag.href = '#';
        anchorTag.setAttribute('data-conversation', '#conversation-1');
        anchorTag.addEventListener('click', userItemClick);

        const userImage = document.createElement('img');
        userImage.classList.add('content-message-image');
        userImage.src = './src/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg';
        userImage.alt = '';

        const messageInfoSpan = document.createElement('span');
        messageInfoSpan.classList.add('content-message-info');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('content-message-name');
        nameSpan.textContent = user.fullName;

        const textSpan = document.createElement('span');
        textSpan.classList.add('content-message-text');
        textSpan.textContent = 'Lorem ipsum dolor sit amet consectetur.';

        const moreSpan = document.createElement('span');
        moreSpan.classList.add('content-message-more');

        const unreadSpan = document.createElement('span');
        unreadSpan.classList.add('content-message-unread');
        unreadSpan.textContent = '1';

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('content-message-time');
        timeSpan.textContent = '12:30';

        moreSpan.appendChild(unreadSpan);
        moreSpan.appendChild(timeSpan);

        messageInfoSpan.appendChild(nameSpan);
        messageInfoSpan.appendChild(textSpan);

        anchorTag.appendChild(userImage);
        anchorTag.appendChild(messageInfoSpan);
        anchorTag.appendChild(moreSpan);

        listItem.appendChild(anchorTag);

        listItem.addEventListener('click', userItemClick);

        connectedUsersList.appendChild(listItem);
}

function userItemClick(event) {
    document.querySelectorAll('.user-item').forEach(item => {
        item.classList.remove('active');
    });
    messageForm.classList.remove('hidden');

    const clickedUser = event.currentTarget;
    clickedUser.classList.add('active');

    selectedUserId = clickedUser.getAttribute('id');
    fetchAndDisplayUserChat().then();

    const nbrMsg = clickedUser.querySelector('.content-message-unread');
    nbrMsg.classList.add('hidden');
    nbrMsg.textContent = '0';
    var user = clickedUser.querySelector('.content-message-name');
    var userTitle = document.querySelector('.conversation-user-name')
//    console.log(clickedUser);
//    console.log(user.textContent);
    userTitle.textContent = user.textContent

}
function displayMessage(senderId, content, fileName, fileType, fileContentBase64) {
    const messageContainer = document.createElement('li');
    messageContainer.classList.add('conversation-item');
    if (senderId === nickname) {
        // messageContainer.classList.add('sender');
    } else {
        messageContainer.classList.add('me');
    }

    const itemSide = document.createElement('div');
    itemSide.classList.add('conversation-item-side');

    const userImage = document.createElement('img');
    userImage.classList.add('conversation-item-image');
    userImage.src = './src/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg';
    userImage.alt = '';

    itemSide.appendChild(userImage);

    const itemContent = document.createElement('div');
    itemContent.classList.add('conversation-item-content');

    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('conversation-item-wrapper');

    const itemBox = document.createElement('div');
    itemBox.classList.add('conversation-item-box');

    const itemText = document.createElement('div');
    itemText.classList.add('conversation-item-text');

    if (fileName && fileType && fileContentBase64) {
        if (fileType.startsWith('image/')) {
            const image = document.createElement('img');
            image.src = `data:${fileType};base64,${fileContentBase64}`;
            image.alt = fileName;
            image.style.maxWidth = '200px';
            itemText.appendChild(image);
        } else {
            const link = document.createElement('a');
            link.href = `data:${fileType};base64,${fileContentBase64}`;
            link.download = fileName;
            link.textContent = fileName;
            itemText.appendChild(link);
        }
    } else {
        const message = document.createElement('p');
        message.textContent = content;
        itemText.appendChild(message);
    }

    const messageTime = document.createElement('div');
    messageTime.classList.add('conversation-item-time');
    messageTime.textContent = new Date().toLocaleTimeString();

    itemText.appendChild(messageTime);

    const itemDropdown = document.createElement('div');
    itemDropdown.classList.add('conversation-item-dropdown');

    const dropdownToggle = document.createElement('button');
    dropdownToggle.type = 'button';
    dropdownToggle.classList.add('conversation-item-dropdown-toggle');
    dropdownToggle.innerHTML = '<i class="ri-more-2-line"></i>';

    const dropdownList = document.createElement('ul');
    dropdownList.classList.add('conversation-item-dropdown-list');

    const shareItem = document.createElement('li');
    const shareLink = document.createElement('a');
    shareLink.href = '#';
    shareLink.innerHTML = '<i class="ri-share-forward-line"></i> Share';
    shareItem.appendChild(shareLink);

    const deleteItem = document.createElement('li');
    const deleteLink = document.createElement('a');
    deleteLink.href = '#';
    deleteLink.innerHTML = '<i class="ri-delete-bin-line"></i> Delete';
    deleteItem.appendChild(deleteLink);

    dropdownList.appendChild(shareItem);
    dropdownList.appendChild(deleteItem);

    itemDropdown.appendChild(dropdownToggle);
    itemDropdown.appendChild(dropdownList);

    itemBox.appendChild(itemText);
    itemBox.appendChild(itemDropdown);

    itemWrapper.appendChild(itemBox);

    itemContent.appendChild(itemWrapper);

    messageContainer.appendChild(itemSide);
    messageContainer.appendChild(itemContent);

    chatArea.appendChild(messageContainer);
}

async function fetchAndDisplayUserChat() {
    const userChatResponse = await fetch(`/messages/${nickname}/${selectedUserId}`);
    const userChat = await userChatResponse.json();
    chatArea.innerHTML = '';
    userChat.forEach(chat => {

        displayMessage(chat.senderId, chat.content);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
}


function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}


//function sendMessage(event) {
//    const messageContent = messageInput.value.trim();
//    if (messageContent && stompClient) {
//        const chatMessage = {
//            senderId: nickname,
//            recipientId: selectedUserId,
//            content: messageInput.value.trim(),
//            timestamp: new Date()
//        };
//        stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
//        displayMessage(nickname, messageInput.value.trim());
//        messageInput.value = '';
//    }
//    chatArea.scrollTop = chatArea.scrollHeight;
//    event.preventDefault();
//}

function sendMessage(event) {
    const messageContent = messageInput.value.trim();
    if (messageContent || fileInput.files.length > 0) {
        if (stompClient) {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = reader.result.split(',')[1];
                    const chatMessage = {
                        senderId: nickname,
                        recipientId: selectedUserId,
                        fileName: file.name,
                        fileType: file.type,
                        fileContentBase64: base64String,
                        timestamp: new Date()
                    };
                    stompClient.send("/app/chat/file", {}, JSON.stringify(chatMessage));
                    displayMessage(nickname, '', file.name, file.type, base64String);
                };
                reader.readAsDataURL(file);
            } else {
                const chatMessage = {
                    senderId: nickname,
                    recipientId: selectedUserId,
                    content: messageContent,
                    timestamp: new Date()
                };
                stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
                displayMessage(nickname, messageContent);
            }
        }
        messageInput.value = '';
        fileInput.value = ''; // Reset file input
    }
    chatArea.scrollTop = chatArea.scrollHeight;
    event.preventDefault();
}


async function onMessageReceived(payload) {
    await findAndDisplayConnectedUsers();
    console.log('Message received', payload);
    const message = JSON.parse(payload.body);

    if (selectedUserId && selectedUserId === message.senderId) {
        if (message.fileContentBase64 && message.fileType.startsWith('image/')) {
            displayMessage(message.senderId, '', message.fileName, message.fileType, message.fileContentBase64);
        } else {
            displayMessage(message.senderId, message.content);
        }

        chatArea.scrollTop = chatArea.scrollHeight;
    }

    if (selectedUserId) {
        document.querySelector(`#${selectedUserId}`).classList.add('active');
    } else {
        messageForm.classList.add('hidden');
    }

    const notifiedUser = document.querySelector(`#${message.senderId}`);
    if (notifiedUser && !notifiedUser.classList.contains('active')) {
        const nbrMsg = notifiedUser.querySelector('.content-message-unread');
        nbrMsg.classList.remove('hidden');
        nbrMsg.textContent = '';
    }
}

/*================================================================================= */

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.style.display = 'none';

document.querySelector('.conversation-form-button').addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            sendFile(base64String, file.name, file.type);
        };
        reader.readAsDataURL(file);
    }
});

function sendFile(base64String, fileName, fileType) {
    if (stompClient) {
        const fileMessage = {
            senderId: nickname,
            recipientId: selectedUserId,
            fileName: fileName,
            fileType: fileType,
            fileContentBase64: base64String,
            timestamp: new Date()
        };
        stompClient.send("/app/chat/file", {}, JSON.stringify(fileMessage));
        displayMessage(nickname, '', fileName, fileType, base64String);
    }
}


usernameForm.addEventListener('submit', connect, true); // step 1
messageForm.addEventListener('submit', sendMessage, true);

logout.addEventListener('click', onLogout, true);
//window.onbeforeunload = () => onLogout();
