
"use strict"; // Start of use strict
/*
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

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.email).appendTo($("body"));
    }
  });
});
*/
$(() => {
  $.ajax({
    method: "GET",
    url: "/api/watch"
  }).done((watch) => {
    $("<div>").text("WATCH").appendTo($("body"));
    for (let i = 0; i < watch.general.length; i++){
      $("<div>").text(watch.general[i].text_from_user).appendTo($("body"));
    }
    for (let i = 0; i < watch.items.length; i++){
      $("<div>").text(watch.items[i].text_from_user).appendTo($("body"));
    }
  });
});
/*
$(() => {
  $.ajax({
    method: "GET",
    url: "/api/eat"
  }).done((eat) => {
    $("<div>").text("EAT").appendTo($("body"));
    for (let i = 0; i < eat.general.length; i++){
      $("<div>").text(eat.general[i].text_from_user).appendTo($("body"));
    }
    for (let i = 0; i < eat.items.length; i++){
      $("<div>").text(eat.items[i].text_from_user).appendTo($("body"));
    }
  });
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/read"
  }).done((read) => {
    $("<div>").text("READ").appendTo($("body"));
    for (let i = 0; i < read.general.length; i++){
      $("<div>").text(read.general[i].text_from_user).appendTo($("body"));
    }
    for (let i = 0; i < read.items.length; i++){
      $("<div>").text(read.items[i].text_from_user).appendTo($("body"));
    }
  });
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/buy"
  }).done((buy) => {
    $("<div>").text("BUY").appendTo($("body"));
    for (let i = 0; i < buy.general.length; i++){
      $("<div>").text(buy.general[i].text_from_user).appendTo($("body"));
    }
    for (let i = 0; i < buy.items.length; i++){
      $("<div>").text(buy.items[i].text_from_user).appendTo($("body"));
    }
  });
});
*/