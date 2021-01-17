$(document).ready(async () => {
  $.get(`/api/posts/${postId}`, (results) => {
    outputPostsWithReplies(results, $('.postsContainer'));
  });
});
