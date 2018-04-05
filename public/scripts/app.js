
"use strict"; // Start of use strict

$(document).ready(function () {
  // Modal popup$(function () {
  // $('.portfolio-item').magnificPopup({
  //   type: 'inline',
  //   preloader: false,
  //   focus: '#username',
  //   modal: true
  // });
  $('.portfolio-item').on('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    clearAndLoadList(this);
  })
  $('#new-item-form').submit(function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    addItem(this);
    return false;
  });

  $(document).on('click', '.portfolio-modal-dismiss', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });
  $('#list-title-bar').on('click', function () {
    slideList()
  });


}); // End of use strict

var shown = true;
function slideList() {
  $("#list-of-items").slideToggle("slow")
  if (shown === true) {
    shown = false;
  } else {
    shown = true;
  }
}

function addItem(form) {
  if ($(form).find('#item-input-field').val() === "") {
    alert("Cannot send empty item");
  } else {
    $.ajax({
      url: '/api/items',
      method: 'POST',
      data: { text_from_user: $(form).find('#item-input-field').val() }
    }).done(() => {
      //$(form)[0].reset();
    })
  }
}

const categories = ['foods', 'products', 'movies', 'books']
const urls = ['eat', 'buy', 'watch', 'read']
function clearAndLoadList(btn) {
  console.log(btn)
  let btnIntent;
  for (let i = 0; i < categories.length; i++) {
    if ($(btn).hasClass(categories[i])) {
      btnIntent = urls[i];
      break;
    }
  }
  $.ajax({
    method: "GET",
    url: `/api/${btnIntent}`
  }).done((items) => {
    clearLists();
    if (items.general) {
      displayNoneList(items.general);
    }
    displayDefinedList(items.items);
  });
}

//Creates item being told the item info and the list it is intended for
function createItem(item, list) {
  let output = `<li>${item.text}</li>`
  $(`#${list}`).prepend(output);
}

//Creates the title bar for the uncategorized list and then calls createItems for all items given, inside of the newly created list
function renderNoneList(items) {
  let list = 'noneList'
  let output = `<div id="noneTitle" class="container list-title-bar"><h2>*no home found items*</h2><ul id='noneList' class="list-of-items"></ul></div>`;
  $('#noneHolder').prepend(output);
  tweetsArr.forEach(function (item) {
    createItem(item, list);
  });
}

//Calls to create items inside of the categorized list for each item given
function renderDefinedList(items) {
  let list = 'catdList'
  $('#noneHolder').prepend(output);
  tweetsArr.forEach(function (item) {
    createItem(item, list);
  });
}

//clears both lists (just categorized items and for uncategorized the title bars as well)
function clearLists() {
  $('#noneTitle').remove();
  $('#catdList').find('li').remove();
}
