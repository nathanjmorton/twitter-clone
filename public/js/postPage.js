$(document).ready(async () => {
  $.get(`/api/posts/${postId}`, (results) => {
    outputPosts(results, $('.postsContainer'));
  });
});
