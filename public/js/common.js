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
$(document).on('click', '.likeButton', (e) => {
  const button = $(e.target);
  var postId = getPostIdFromElement(button);

  if (postId === undefined) {
    return;
  }

  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: 'PUT',
    success: (postData) => {
      button.find('span').text(postData.likes.length || '');

      if (postData.likes.includes(userLoggedIn._id)) {
        button.addClass('active');
      } else {
        button.removeClass('active');
      }
    },
  });
});

$(document).on('click', '.retweetButton', (e) => {
  const button = $(e.target);
  var postId = getPostIdFromElement(button);

  if (postId === undefined) {
    return;
  }

  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: 'POST',
    success: (postData) => {
      button.find('span').text(postData.retweetUsers.length || '');

      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass('active');
      } else {
        button.removeClass('active');
      }
    },
  });
});

const getPostIdFromElement = (element) => {
  const isRoot = element.hasClass('post');
  const rootElement = isRoot ? element : element.closest('.post');
  const postId = rootElement.data().id;
  if (postId === undefined) {
    return alert('post id undefined');
  }
  return postId;
};

const createPostHtml = (postData) => {
  // const {
  //   postedBy: { profilePic, username, firstName, lastName, createdAt },
  //   content,
  // } = postData;
  const postedBy = postData.postedBy;
  const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id)
    ? 'active'
    : '';
  const retweetButtonActiveClass = postData.retweetUsers.includes(
    userLoggedIn._id
  )
    ? 'active'
    : '';

  if (postData._id === undefined) {
    return console.log('user object not populated');
  }

  const displayName = postedBy.firstName + ' ' + postedBy.lastName;

  return `<div class='post' data-id=${postData._id}>
    <div class='mainContentContainer'>
      <div class='userImageContainer'>
        <img src='${postedBy.profilePic}'>
      </div>
      <div class='postContentContainer'>
        <div class='header'>
          <a href='/profile/${
            postedBy.username
          }' class='displayName'>${displayName}</a>
          <span class='username'>@${postedBy.username}</span>
          <span class='date'>${timestamp}</span>
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
          <div class='postButtonContainer green'>
            <button class='retweetButton ${retweetButtonActiveClass}'>
              <i class='fas fa-retweet'></i>
              <span>${postData.retweetUsers.length || ''}</span>
            </button>
          </div>
          <div class='postButtonContainer red'>
            <button class='likeButton ${likeButtonActiveClass}'>
              <i class='far fa-heart'></i>
              <span>${postData.likes.length || ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return 'Just now';
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}
