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
    console.log(data);
  });
};
