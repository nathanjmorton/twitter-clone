$(document).ready(() => {
  loadPosts();
});

const loadPosts = () => {
  $.get('/api/posts', { postedBy: profileUserId }, (results) => {
    outputPosts(results, $('.postsContainer'));
  });
};
