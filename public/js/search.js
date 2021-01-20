let timer;
$('#searchBox').keydown((e) => {
  clearTimeout(timer);
  const textbox = $(e.target);
  const value = textbox.val();
  const searchType = textbox.data().search;

  console.log(value);
  console.log('searchType:', searchType);
});
