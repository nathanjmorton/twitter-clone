$(document).ready(async () => {
  $.get('/api/posts', { followingOnly: true }, (results) => {
    outputPosts(results, $('.postsContainer'));
  });
});
