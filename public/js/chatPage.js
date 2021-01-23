$(document).ready(() => {
  $.get(`/api/chats/${chatId}`, (data) => {
    $('#chatName').text(getChatName(data));
  });
});

$('#chatNameButton').click(() => {
  const name = $('#chatNameTextbox').val().trim();

  $.ajax({
    url: `/api/chats/${chatId}`,
    type: 'PUT',
    data: { chatName: name },
    success: (data, status, xhr) => {
      if (xhr.status !== 204) {
        alert('could not update');
      } else {
        location.reload();
      }
    },
  });
});

$('.sendMessageButton').click(() => {
  messageSubmitted();
});

$('.inputTextbox').keydown((e) => {
  if (e.which === 13 && !e.shiftKey) {
    messageSubmitted();
    return false;
  }
});

const messageSubmitted = () => {
  const content = $('.inputTextbox').val().trim();
  if (content !== '') {
    sendMessage(content);
    $('.inputTextbox').val('');
  }
};

const sendMessage = (content) => {
  $.post('/api/messages', { content, chatId }, (data, status, xhr) => {
    addChatMessageHtml(data);
  });
};

const addChatMessageHtml = (message) => {
  if (!message || !message._id) {
    alert('message is not valid');
    return;
  }
  const messageDiv = createMessageHtml(message);

  $('.chatMessages').append(messageDiv);
};

const createMessageHtml = (message) => {
  const isMine = message.sender._id === userLoggedIn._id;
  const liClassName = isMine ? 'mine' : 'theirs';

  return `
    <li class='message ${liClassName}'>
      <div class='messageContainer'> 
        <span class='messageBody'>
          ${message.content}
        </span>
      </div>
    </li>
  `;
};
