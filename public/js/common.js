// Globals
let cropper;
let timer;
let selectedUsers = [];

$('#postTextarea, #replyTextarea').keyup((e) => {
  const textbox = $(e.target);
  const value = textbox.val().trim();

  const isModal = textbox.parents('.modal').length === 1;

  const submitButton = isModal
    ? $('#submitReplyButton')
    : $('#submitPostButton');

  if (submitButton.length === 0) {
    return alert('no submit button found');
  }
  if (value === '') {
    submitButton.prop('disabled', true);
    return;
  }
  submitButton.prop('disabled', false);
});

$('#submitPostButton, #submitReplyButton').click((e) => {
  const button = $(e.target);
  const isModal = button.parents('.modal').length === 1;
  const textbox = isModal ? $('#replyTextarea') : $('#postTextarea');

  const data = {
    content: textbox.val(),
  };

  if (isModal) {
    const id = button.data().id;
    if (id === null) {
      return alert('button id is null');
    }
    data.replyTo = id;
  }

  $.post('/api/posts', data, (postData) => {
    if (postData.replyTo) {
      location.reload();
    } else {
      const html = createPostHtml(postData);
      $('.postsContainer').prepend(html);
      textbox.val('');
      button.prop('disabled', true);
    }
  });
});

$('#replyModal').on('show.bs.modal', (e) => {
  const button = $(e.relatedTarget);
  const postId = getPostIdFromElement(button);
  $('#submitReplyButton').data('id', postId);

  $.get(`/api/posts/${postId}`, (results) => {
    outputPosts(results.postData, $('#originalPostContainer'));
  });
});

$('#replyModal').on('hidden.bs.modal', (e) => {
  $('#originalPostContainer').html('');
});

$('#deletePostModal').on('show.bs.modal', (e) => {
  const button = $(e.relatedTarget);
  const postId = getPostIdFromElement(button);
  $('#deletePostButton').data('id', postId);
});

$('#confirmPinModal').on('show.bs.modal', (e) => {
  const button = $(e.relatedTarget);
  const postId = getPostIdFromElement(button);
  $('#pinPostButton').data('id', postId);
});

$('#unpinModal').on('show.bs.modal', (e) => {
  const button = $(e.relatedTarget);
  const postId = getPostIdFromElement(button);
  $('#unpinPostButton').data('id', postId);
});

$('#deletePostButton').click((e) => {
  const postId = $(e.target).data('id');

  $.ajax({
    url: `/api/posts/${postId}`,
    type: 'DELETE',
    success: (data, status, xhr) => {
      if (xhr.status !== 202) {
        alert('could not delete post');
        return;
      }
      location.reload();
    },
  });
});

$('#pinPostButton').click((e) => {
  const postId = $(e.target).data('id');

  $.ajax({
    url: `/api/posts/${postId}`,
    type: 'PUT',
    data: { pinned: true },
    success: (data, status, xhr) => {
      if (xhr.status !== 204) {
        alert('could not delete post');
        return;
      }
      location.reload();
    },
  });
});

$('#unpinPostButton').click((e) => {
  const postId = $(e.target).data('id');

  $.ajax({
    url: `/api/posts/${postId}`,
    type: 'PUT',
    data: { pinned: false },
    success: (data, status, xhr) => {
      if (xhr.status !== 204) {
        alert('could not delete post');
        return;
      }
      location.reload();
    },
  });
});

$('#filePhoto').change((e) => {
  const input = $(e.target)[0];

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = document.querySelector('#imagePreview');
      image.src = e.target.result;
      // $('#imagePreview').attr('src', e.target.result);

      if (cropper !== undefined) {
        cropper.destroy();
      }
      cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        background: false,
      });
    };
    reader.readAsDataURL(input.files[0]);
  }
});

$('#coverPhoto').change((e) => {
  const input = $(e.target)[0];

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = document.querySelector('#coverPreview');
      image.src = e.target.result;
      // $('#imagePreview').attr('src', e.target.result);

      if (cropper !== undefined) {
        cropper.destroy();
      }
      cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        background: false,
      });
    };
    reader.readAsDataURL(input.files[0]);
  }
});

$('#imageUploadButton').click(() => {
  const canvas = cropper.getCroppedCanvas();

  if (canvas === null) {
    alert('could not upload image make sure it is an image file');
    return;
  }

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append('croppedImage', blob);
    $.ajax({
      url: '/api/users/profilePicture',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: () => {
        location.reload();
      },
    });
  });
});

$('#coverPhotoButton').click(() => {
  const canvas = cropper.getCroppedCanvas();

  if (canvas === null) {
    alert('could not upload image make sure it is an image file');
    return;
  }

  canvas.toBlob((blob) => {
    const formData = new FormData();
    formData.append('croppedImage', blob);
    $.ajax({
      url: '/api/users/coverPhoto',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: () => {
        location.reload();
      },
    });
  });
});

$('#userSearchTextbox').keydown((e) => {
  clearTimeout(timer);
  const textbox = $(e.target);
  let value = textbox.val();

  if (value === '' && (e.which === 8 || e.keyCode === 8)) {
    // remove user from selection
    selectedUsers.pop();
    updateSelectedUsersHtml();
    $('.resultsContainer').html('');

    if (selectedUsers.length === 0) {
      $('#createChatButton').prop('disabled', true);
    }

    return;
  }

  timer = setTimeout(() => {
    value = textbox.val().trim();

    if (value === '') {
      $('.resultsContainer').html('');
    } else {
      searchUsers(value);
    }
  }, 1000);
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

$(document).on('click', '.post', (e) => {
  const element = $(e.target);
  var postId = getPostIdFromElement(element);

  if (postId !== undefined && !element.is('button')) {
    window.location.href = `/post/${postId}`;
  }
});

$(document).on('click', '.followButton', (e) => {
  const button = $(e.target);
  const userId = button.data().user;

  $.ajax({
    url: `/api/users/${userId}/follow`,
    type: 'PUT',
    success: (data, status, xhr) => {
      if (xhr.status === 404) {
        alert('user not found');
        return;
      }

      let difference = 1;
      if (data.following && data.following.includes(userId)) {
        button.addClass('following');
        button.text('Following');
      } else {
        button.removeClass('following');
        button.text('Follow');
        difference = -1;
      }

      const followersLabel = $('#followersValue');
      if (followersLabel.length !== 0) {
        let followersText = followersLabel.text();
        followersText = parseInt(followersText);
        followersLabel.text(followersText + difference);
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

const createPostHtml = (postData, largeFont = false) => {
  // const {
  //   postedBy: { profilePic, username, firstName, lastName, createdAt },
  //   content,
  // } = postData;
  if (postData === null) {
    return alert('post object is null');
  }

  const isRetweet = postData.retweetData !== undefined;
  const retweetBy = isRetweet ? postData.postedBy.username : null;
  postData = isRetweet ? postData.retweetData : postData;

  const postedBy = postData.postedBy;

  if (postedBy._id === undefined) {
    return console.log('user object not populated');
  }

  const displayName = postedBy.firstName + ' ' + postedBy.lastName;
  const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id)
    ? 'active'
    : '';
  const retweetButtonActiveClass = postData.retweetUsers.includes(
    userLoggedIn._id
  )
    ? 'active'
    : '';
  const largeFontClass = largeFont ? 'largeFont' : '';

  let retweetText = '';
  if (isRetweet) {
    retweetText = `<span>
      <i class='fas fa-retweet'></i>
      Retweeted by <a href='/profile/${retweetBy}'>@${retweetBy}</a>
    </span>`;
  }

  let replyFlag = '';
  if (postData.replyTo && postData.replyTo._id) {
    if (!postData.replyTo._id) {
      return alert('replyTo is not populated');
    } else if (!postData.replyTo.postedBy._id) {
      return alert('postedBy is not populated');
    }
    const replyToUsername = postData.replyTo.postedBy.username;
    replyFlag = `<div class='replyFlag'>
      Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
    </div>`;
  }

  let buttons = '';
  let pinnedPostText = '';
  if (postData.postedBy._id === userLoggedIn._id) {
    let dataTarget = '#confirmPinModal';
    let pinnedClass = '';
    if (postData.pinned === true) {
      pinnedClass = 'active';
      dataTarget = '#unpinModal';
      pinnedPostText =
        "<i class='fas fa-thumbtack'></i>  <span>Pinned post</span>";
    }

    buttons = `<button class='pinButton ${pinnedClass}' data-id='${postData._id}' data-toggle='modal' data-target='${dataTarget}'>
      <i class="fas fa-thumbtack"></i>
    </button>
    <button data-id='${postData._id}' data-toggle='modal' data-target='#deletePostModal'>
      <i class="fas fa-times"></i>
    </button>`;
  }

  return `<div class='post ${largeFontClass}' data-id=${postData._id}>
    <div class='postActionContainer'>
      ${retweetText}
    </div>
    <div class='mainContentContainer'>
      <div class='userImageContainer'>
        <img src='${postedBy.profilePic}'>
      </div>
      <div class='postContentContainer'>
        <div class='pinnedPostText'>${pinnedPostText}</div>
        <div class='header'>
          <a href='/profile/${
            postedBy.username
          }' class='displayName'>${displayName}</a>
          <span class='username'>@${postedBy.username}</span>
          <span class='date'>${timestamp}</span>
          ${buttons}
        </div>
        ${replyFlag}
        <div class='postBody'>
          <span>${postData.content}</span>
        </div>
        <div class='postFooter'>
          <div class='postButtonContainer'>
            <button data-toggle='modal' data-target='#replyModal'>
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

const outputPosts = (results, container) => {
  container.html('');

  if (!Array.isArray(results)) {
    results = [results];
  }

  results.forEach((result) => {
    let html = createPostHtml(result);
    container.append(html);
  });

  if (results.length === 0) {
    container.append(`<span class='noResults'>Nothing to show</span>`);
  }
};

const outputPostsWithReplies = (results, container) => {
  container.html('');

  if (results.replyTo !== undefined && results.replyTo._id !== undefined) {
    let html = createPostHtml(results.replyTo);
    container.append(html);
  }

  let mainPostHtml = createPostHtml(results.postData, true);
  container.append(mainPostHtml);

  results.replies.forEach((result) => {
    let html = createPostHtml(result);
    container.append(html);
  });
};

const outputUsers = (results, container) => {
  container.html('');

  results.forEach((result) => {
    html = createUserHtml(result, true);
    container.append(html);
  });

  if (results.length === 0) {
    container.append("<span class='noResults'>No results found</span>");
  }
};

const createUserHtml = (userData, showFollowButton) => {
  const name = `${userData.firstName} ${userData.lastName}`;
  const isFollowing =
    userLoggedIn.following && userLoggedIn.following.includes(userData._id);
  const text = isFollowing ? 'Following' : 'Follow';
  const buttonClass = isFollowing ? 'followButton following' : 'followButton';

  let followButton = '';
  if (showFollowButton && userLoggedIn._id !== userData._id) {
    followButton = `<div class ='followButtonContainer'>
      <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
    </div>`;
  }

  return `<div class='user'>
    <div class='userImageContainer'>
      <img src='${userData.profilePic}' />
    </div>
    <div class='userDetailsContainer'>
      <div class='header'>
        <a href='/profile/${userData.username}'>${name}</a>
        <span class='username'>@${userData.username}</span>
      </div>
    </div>
    ${followButton}
  </div>`;
};

const searchUsers = (searchTerm) => {
  $.get('/api/users', { search: searchTerm }, (results) => {
    outputSelectableUsers(results, $('.resultsContainer'));
  });
};

const outputSelectableUsers = (results, container) => {
  container.html('');

  results.forEach((result) => {
    if (
      result._id === userLoggedIn._id ||
      selectedUsers.some((u) => u._id === result._id)
    ) {
      return;
    }

    html = createUserHtml(result, false);
    let element = $(html);
    element.click((e) => userSelected(result));
    container.append(element);
  });

  if (results.length === 0) {
    container.append("<span class='noResults'>No results found</span>");
  }
};

const userSelected = (user) => {
  selectedUsers.push(user);
  updateSelectedUsersHtml();
  $('#userSearchTextbox').val('').focus();
  $('.resultsContainer').html('');
  $('#createChatButton').prop('disabled', false);
};

const updateSelectedUsersHtml = () => {
  let elements = [];

  selectedUsers.forEach((user) => {
    const name = user.firstName + ' ' + user.lastName;
    const userElement = $(`<span class='selectedUser'>${name}</span>`);
    elements.push(userElement);
  });

  $('.selectedUser').remove();
  $('#selectedUsers').prepend(elements);
};
