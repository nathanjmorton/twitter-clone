document.querySelector('#postTextarea').addEventListener('keyup', (e) => {
  const textbox = e.target;
  const value = textbox.value.trim();
  var submitButton = document.querySelector('#submitPostButton');
  if (submitButton.length === 0) {
    return alert('no submit button found');
  }
  if (value === '') {
    submitButton.disabled = true;
    return;
  }
  submitButton.disabled = false;
});
