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
  // const {
  //   postedBy: { profilePic, username, firstName, lastName, createdAt },
  //   content,
  // } = postData;
  const displayName = postData.firstName + ' ' + postData.lastName;

  return `<div class='post'>
    <div class='mainContentContainer'>
      <div class='userImageContainer'>
        <img src='${postData.profilePic}'>
      </div>
      <div class='postContentContainer'>
        <div class='header'>
          <a href='/profile/${postData.username}' class='displayName'>${displayName}</a>
          <span class='username'>@${postData.username}</span>
          <span class='date'>${postData.createdAt}</span>
        </div>
        <div class='postBody'>
          <span>${postData.content}</span>
        </div>
        <div class='postFooter'>
          <div class='postButtonContainer'>
            <button>
              <i class='far fa-comment'></i>
            </button>
          </div>
          <div class='postButtonContainer'>
            <button>
              <i class='fas fa-retweet'></i>
            </button>
          </div>
          <div class='postButtonContainer'>
            <button>
              <i class='far fa-heart'></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};
