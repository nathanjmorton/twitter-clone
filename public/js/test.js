$('#postTextarea, #replyTextarea').keyup((event) => {
  var textbox = $(event.target);
  var value = textbox.val().trim();

  var isModal = textbox.parents('.modal').length == 1;

  var submitButton = isModal ? $('#submitReplyButton') : $('#submitPostButton');

  if (submitButton.length == 0) return alert('No submit button found');

  if (value == '') {
    submitButton.prop('disabled', true);
    return;
  }

  submitButton.prop('disabled', false);
});