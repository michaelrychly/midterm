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
    clearAndLoadList(this).then(function () {
      $('html, body').animate({
        scrollTop: $("#portfolio").offset().top
      }, 500);
      $('.list-title-bar').off("click", slideList);
      $('.list-title-bar').click(function (e) {
        e.stopImmediatePropagation();
        slideList(this)
      }
      );
    }).catch(e => {
      console.log("error: ", e);
    })
  })
  $('#new-item-form').submit(function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    updateItem(this);
    return false;
  });

  $(document).on('click', '.portfolio-modal-dismiss', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });
});

var shown = true;
function slideList(list) {
  $(list).children('ul').slideToggle("slow")
  if ($('#noneTitle').length > 0) {
    $('#noneTitle').css('display', '');
  }
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

function deleteItem(form) {
  if ($(form).find('#item-input-field').val() === "") {
    alert("Cannot send empty item");
  } else {
    $.ajax({
      url: '/api/items/40',
      method: 'DELETE'
    }).done(() => {
      //$(form)[0].reset();
    })
  }
}

function updateItem(form) {
  if ($(form).find('#item-input-field').val() === "") {
    alert("Cannot send empty item");
  } else {
    $.ajax({
      url: '/api/items/21',
      method: 'PUT',
      data: { text_from_user: $(form).find('#item-input-field').val(),
      state: true, category_id: 2 }
    }).done(() => {
      //$(form)[0].reset();
    }).catch(function (error) {
      console.error(error);
    })
  }
}

var categories = ['foods', 'products', 'movies', 'books'];
var urls = ['eat', 'buy', 'watch', 'read'];
var oldList;

function clearAndLoadList(btn) {
  return new Promise(function (resolve, reject) {
    let btnIntent;
    let index
    for (let i = 0; i < categories.length; i++) {
      if ($(btn).hasClass(categories[i])) {
        btnIntent = urls[i];
        index = i;
        break;
      }
    }
    $.ajax({
      method: "GET",
      url: `/api/${btnIntent}`,
      success: ((items) => {
        let generalList = $('#noneList')
        if (items.general && $('#noneList').css('display') !== 'none') {
          clearNoneLists();
          renderList(items.general, 'noneList', null);
        }
        clearCatLists();
        renderList(items.items, 'catdList', index);
        return resolve('success');
        if (!items) {
          return reject()
        }
      })
    });
  });
}


//Creates item being told the item info and the list it is intended for
function createItem(item, list) {
  let output = `<li>${item.text_from_user}</li>`
  $(`#${list}`).prepend(output);
}

var titles = ['Something To eat!', 'Something To Buy!', 'Something To Watch!', 'Something To Read!']
//Creates the title bar for the uncategorized list and then calls createItems for all items given, inside of the newly created list
function renderList(items, list, cat) {
  if (list === 'noneList') {
    let output = `<div id="noneTitle" class="container list-title-bar"><h2>To Decide</h2><ul id='noneList' class="list-of-items"></ul></div>`;
    $('#noneHolder').prepend(output);
  } else {
    let output = `<div id="catdTitle" class="container list-title-bar"><h2>${titles[cat]}</h2><ul id='catdList' class="list-of-items"></ul></div>`;
    $('#catdHolder').prepend(output);
  }
  items.forEach(function (item) {
    createItem(item, list);
  });
}


//clears both lists (just categorized items and for uncategorized the title bars as well)
function clearCatLists() {
  $('#catdTitle').remove();
}
function clearNoneLists() {
  $('#noneTitle').remove();
}