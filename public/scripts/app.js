"use strict"; // Start of use strict
var currentTarget;
var categories = ['foods', 'products', 'movies', 'books'];
var urls = ['eat', 'buy', 'watch', 'read'];
var oldList;

$(document).ready(function () {
  $('.portfolio-item').on('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    clearAndLoadList(this).then(function () {
      $('html, body').animate({
        scrollTop: $("#portfolio").offset().top
      }, 500);
      $('.list-title-bar').off("click", slideList);
      $('.list-title-bar').click(function (e) {
        if ($(e.target).hasClass('fa-edit')) {
          // if the edit button is the target
          e.preventDefault();
          e.stopImmediatePropagation();
          currentTarget = $(e.target).parent('li').attr('id');
          editModal(currentTarget);
          $('#id02').css('display', 'block');
          $('#id02').find('form').on('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            updateItemText(currentTarget);
            currentTarget = null;
          });

        } else if ($(e.target).hasClass('fa-minus-square-o')) {
          // if the delete button is the target
          e.preventDefault();
          e.stopImmediatePropagation();
          // send request to delete
          let id = $(e.target).parent('li').attr('id');
          deleteItem(id);

        } else if ($(e.target).hasClass('fa-check-square-o')) {
          // if the target was the state button
          e.preventDefault();
          e.stopImmediatePropagation();
          //send request to update 'state'
          let id = $(e.target).parent('li').attr('id');
          updateItemState(id);
          $('i .green').parent('li').appendTo('#catdList');

        } else {
          e.preventDefault();
          e.stopImmediatePropagation();
          slideList(this)
        }
      });
    }).catch(e => {
      console.error("error: ", e);
    })
  });

  $('#new-item-form').submit(function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    addItem(this);
    return false;
  });

  $('#logRegBtn').on('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $('#id01').css('display', 'block');
    $('#id01').find('form').on('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      console.log(e.target);
      if ($(e.target).find('button').hasClass('register')) {
        register();
      } else if ($(e.target).find('button').hasClass('register')) {
        login();
      }
    });
  })
});

function login() {
  if ($('form').find('#username-field').val() === "" || $('form').find('#password-field').val() === "") {
    alert("Cannot Login/Register with an empty item");
  } else {
    $.ajax({
      url: '/login',
      method: 'PUT',
      data: { username: $('form').find('#username-field').val(), password: $('form').find('#username-field').val() }
    })
  }
}

function register() {
  if ($('form').find('#username-field').val() === "" || $('form').find('#password-field').val() === "") {
    alert("Cannot Login/Register with an empty item");
  } else {
    $.ajax({
      url: '/register',
      method: 'PUT',
      data: { username: $('form').find('#username-field').val(), password: $('form').find('#username-field').val() }
    })
  }
}

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

function editModal(id) {
  //get text from list id for placeholder in form
  let placeHolder = $(`#${id}`).text();
  $('#id02').find('input').attr("placeholder", `${placeHolder}`);
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
      $(form)[0].reset();
    })
  }
}

function deleteItem(id) {
  $.ajax({
    url: `/api/items/${id}`,
    method: 'DELETE'
  }).done(() => {
    $(`li #${id}`).remove();
  }).catch(function (error) {
    console.error(error);
  })
}

function updateItemText(id) {
  if ($('form').find('#item-update-field').val() === "") {
    alert("Cannot update to an empty item");
  } else {
    $.ajax({
      url: `/api/items/${id}`,
      method: 'PUT',
      data: { text_from_user: $('form').find('#item-update-field').val(), category_id: $('form').find('#catDropDown').val() }
    }).done(() => {
      $('form')[0].reset();
      $('#id02').css('display', 'none');
    }).catch(function (error) {
      console.error(error);
    })
  }
}
function updateItemState(id) {
  $.ajax({
    url: `/api/items/${id}`,
    method: 'PUT',
    data: { state: 'would you please kindly toggle the state' },
    success: ((state) => {
      //toggle change font awesome color to green or off green depending on server response
      $(`li #${id}`).find('.fa-check-square-o').removeClass('green')
      if (state) {
        $(`li #${id}`).find('.fa-check-square-o').addClass('green')
      }
    })
  })
}

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
  let output = `<li id="${item.id}">${item.text_from_user}<i class="${item.state ? "green" : ""} modifyItem fa fa-check-square-o"></i><i id="item.id" class="modifyItem fa fa-edit"></i><i id="item.id" class="modifyItem fa fa-minus-square-o"></i></li>`
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