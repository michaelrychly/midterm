"use strict"; // Start of use strict

$(document).ready(function () {
  // Modal popup$(function () {
  $('.portfolio-item').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#username',
    modal: true
  });
  $(document).on('click', '.portfolio-modal-dismiss', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });
  $('#list-title-bar').on('click', function () {
    slideList()
  });

}); // End of use strict

let shown = true;
function slideList() {
  $("#list-of-items").slideToggle("slow")
  if (shown === true) {
    shown = false;
  } else {
    shown = true;
  }
}