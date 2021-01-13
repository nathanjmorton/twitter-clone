$(document).ready(async () => {
  $.get('/api/posts', (results) => {
    outputPosts(results, $('.postsContainer'));
  });
});

const outputPosts = (results, container) => {
  container.html('');

  results.forEach((result) => {
    let html = createPostHtml(result);
    container.append(html);
  });

  if (results.length === 0) {
    container.append(`<span class='noResults'>Nothing to show</span>`);
  }
};
