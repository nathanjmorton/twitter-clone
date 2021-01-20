let timer;
$('#searchBox').keydown((e) => {
  clearTimeout(timer);
  const textbox = $(e.target);
  let value = textbox.val();
  const searchType = textbox.data().search;

  timer = setTimeout(() => {
    value = textbox.val().trim();

    if (value === '') {
      $('.resultsContainer').html('');
    } else {
      search(value, searchType);
    }
  }, 1000);
});

const search = (searchTerm, searchType) => {
  const url = searchType === 'users' ? '/api/users' : '/api/posts';
  $.get(url, { search: searchTerm }, (results) => {
    if (searchType === 'users') {
      console.log('user search results: ', results);
    } else {
      outputPosts(results, $('.resultsContainer'));
    }
  });
};
