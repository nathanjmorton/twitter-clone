$(document).ready(() => {
  if (selectedTab === 'replies') {
    loadFollowers();
  } else {
    loadFollowing();
  }
});

const loadFollowers = () => {
  $.get(
    '/api/posts',
    { postedBy: profileUserId, isReply: false },
    (results) => {
      outputPosts(results, $('.postsContainer'));
    }
  );
};

const loadFollowing = () => {
  $.get('/api/posts', { postedBy: profileUserId, isReply: true }, (results) => {
    outputPosts(results, $('.postsContainer'));
  });
};
