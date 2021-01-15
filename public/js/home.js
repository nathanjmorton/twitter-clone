$(document).ready(async () => {
  $.get('/api/posts', (results) => {
    outputPosts(results, $('.postsContainer'));
  });
});
