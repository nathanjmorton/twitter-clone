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
  console.log(`postData:`, postData);
  const postedBy = postData.postedBy;

  if (postData._id === undefined) {
    return console.log('user object not populated');
  }

  const displayName = postedBy.firstName + ' ' + postedBy.lastName;

  return `<div class='post'>
    <div class='mainContentContainer'>
      <div class='userImageContainer'>
        <img src='${postedBy.profilePic}'>
      </div>
      <div class='postContentContainer'>
        <div class='header'>
          <a href='/profile/${postedBy.username}' class='displayName'>${displayName}</a>
          <span class='username'>@${postedBy.username}</span>
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
