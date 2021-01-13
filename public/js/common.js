document.querySelector('#postTextarea').addEventListener('keyup', (e) => {
  const textbox = e.target;
  const value = textbox.value.trim();
  const submitButton = document.querySelector('#submitPostButton');
  if (submitButton.length === 0) {
    return alert('no submit button found');
  }
  if (value === '') {
    submitButton.disabled = true;
    return;
  }
  submitButton.disabled = false;
});

$('#submitPostButton').click((e) => {
  const button = $(e.target);
  const textbox = $('#postTextarea');

  const data = {
    content: textbox.val(),
  };

  $.post('/api/posts', data, (postData) => {
    const html = createPostHtml(postData);
    $('.postsContainer').prepend(html);
    textbox.val('');
    button.prop('disabled', true);
  });
});

const createPostHtml = (postData) => {
  return postData.content;
};
