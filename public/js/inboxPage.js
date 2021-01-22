$(document).ready(() => {
  $.get('/api/chats', (data, status, xhr) => {
    if (xhr.status === 400) {
      alert('Could not get chat list');
    } else {
      outputChatList(data, $('.resultsContainer'));
    }
  });
});

outputChatList = (chatList, container) => {
  chatList.forEach((chat) => {
    let html = createChatHtml(chat);
    container.append(html);
  });

  if (chatList.length === 0) {
    container.append("<span class='noResults'>Nothing found</span>");
  }
};

const createChatHtml = (chatData) => {
  let chatName = getChatName(chatData);
  let image = getChatImageElements(chatData);
  let latestMessage = 'This is the latest message';
  return `<a href='/messages/${chatData._id}' class='resultListItem'>
    ${image}
    <div class='resultsDetailsContainer ellipsis'>
      <span class='heading ellipsis'>${chatName}</span>
      <span class='subtext ellipsis'>${latestMessage}</span>
    </div>
  </a>`;
};

const getChatName = (chatData) => {
  let chatName = chatData.chatName;

  if (!chatName) {
    let otherChatUsers = getOtherChatUsers(chatData.users);
    let namesArray = otherChatUsers.map(
      (user) => user.firstName + ' ' + user.lastName
    );
    chatName = namesArray.join(', ');
  }
  return chatName;
};

const getOtherChatUsers = (users) => {
  if (users.length === 1) {
    return users;
  }
  return users.filter((user) => user._id !== userLoggedIn._id);
};

const getChatImageElements = (chatData) => {
  let otherChatUsers = getOtherChatUsers(chatData.users);
  let groupChatClass = '';
  let chatImage = getUserChatImageElement(otherChatUsers[0]);

  if (otherChatUsers.length > 1) {
    groupChatClass = 'groupChatImage';
    chatImage += getUserChatImageElement(otherChatUsers[1]);
  }

  return `<div class='resultsImageContainer ${groupChatClass}'>${chatImage}</div>`;
};

const getUserChatImageElement = (user) => {
  if (!user || !user.profilePic) {
    return alert('user passed into function is invalid');
  }

  return `<img src='${user.profilePic}' alt='User profile pic' />`;
};