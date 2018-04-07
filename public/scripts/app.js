"use strict"; // Start of use strict
var currentTarget;
var oldList;

$(document).ready(function () {
  $('body').click(function (e) {
    e.stopImmediatePropagation();
    if (!$(event.target).parents('section').length && !$(event.target).is('section')) {
      $(".modal").css('display', '');
    }
  });

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

        } else if ($(e.target).hasClass('fa-link')) {
          e.stopImmediatePropagation();

        } else if (e.target.tagName == 'LI') {
          let id = $(e.target).attr('id');
          let targetClass = $(e.target).attr('class');
          if (targetClass == 2) {
            loadDetails(id); // targetClass);
          }
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
    $('#id01').find('button.register').on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      register().then(() => {
        $('#logoutBtn').on('click', function (e) {
          location.reload();
        })
      })
    });
    $('#id01').find('button.login').on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      login().then(() => {
        $('#logoutBtn').on('click', function (e) {
          location.reload();
        })
      })
    });
  })
});

var categories = ['foods', 'products', 'movies', 'books'];
var urls = ['eat', 'buy', 'watch', 'read'];

function loadDetails(id) {
  $.ajax({
    url: `/api/items/${id}/details`,
    method: 'GET',
    success: ((res) => {
      loadMovieModal(res);
    })
  })
}

function loadMovieModal(data) {
  let output = `<form class="modal-content-movie animate updateForm">
  <section class='modalContainer'>
  <div class="imgcontainer">
    <span onclick="document.getElementById('movieModal').style.display='none'" class="close" title="Close Modal">&times;</span>
    <img src=${data.poster} alt="Poster" class="poster">
  </div>
  <div class="container">
    <h6 for="title"><b>${data.title} released in ${data._year_data}</b></h6>
    <h6> Directed by ${data.director}. Starring: ${data.actors}. </h6>
    <p> ${data.plot} </p>
  </div>
  </section>
  </form>`;
  $('#movieModal').find('form').remove();
  $('#movieModal').append(output);

  $('#movieModal').css('display', 'block');
}

/* <div class="container" style="background-color:#f1f1f1">
<button type="button" onclick="document.getElementById('movieModal').style.display='none'" class="modalbtn cancelbtn">Cancel</button>
</div> */

function login() {
  return new Promise(function (resolve, reject) {
    if ($('form').find('#username-field').val() === "" || $('form').find('#password-field').val() === "") {
      alert("Cannot Login/Register with an empty item");
    } else {
      $.ajax({
        url: '/api/users/login',
        method: 'PUT',
        data: { username: $('form').find('#username-field').val(), password: $('form').find('#password-field').val()},
        success: ((res) => {
          if (!res[1]) {
            alert('Unacceptable Username/Password')
            return reject();
          } else {
            // location = location;
            removeNavBar();
            $('#id01').css('display', '');
            loadNavBar(res[0]);
            return resolve();
          }
        })
      })
    }
  })
}

function register() {
  return new Promise(function (resolve, reject) {
    if ($('form').find('#username-field').val() === "" || $('form').find('#password-field').val() === "") {
      alert("Cannot Login/Register with an empty item");
    } else {
      $.ajax({
        url: '/api/users/register',
        method: 'PUT',
        data: { username: $('form').find('#username-field').val(), password: $('form').find('#password-field').val() },
        success: ((res) => {
          if (!res[1]) {
            alert('Unacceptable Username/Password')
            return reject();
          } else {
            //location = location;
            removeNavBar();
            $('#id01').css('display', '');
            loadNavBar(res[0]);
            return resolve();
          }
        })
      })
    }
  })
}

function removeNavBar() {
  $('nav').find('li').remove()
}
function loadNavBar(username) {
  if (username) {
    let output = `<li class="nav-item mx-0 mx-lg-1">
          <a id="username" class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger">${username}</a>
        </li><li class="nav-item mx-0 mx-lg-1">
        <a id="logoutBtn" class="logoutBtn nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger">Logout</a>
      </li>`;
    $('nav').find('ul').append(output)
  } else {
    let output = `<li class="nav-item mx-0 mx-lg-1">
          <a id="logRegBtn" class="nav-link py-3 px-0 px-lg-3 rounded js-scroll-trigger">Login/Register</a>
        </li>`;
    $('nav').find('ul').append(output)
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
    $(`li#${id}`).remove();
  }).catch(function (error) {
    console.error(error);
  })
}

function updateItemText(id) {
  let output = $('form').find('#item-update-field').val();
  if ($('form').find('#item-update-field').val() === "") {
    output = $('#id02').find('input').attr("placeholder");
  }

  if ($('form').find('#item-update-field').val() === "" && $('form').find('#catDropDown').val() == 0) {
    alert("Cannot update item with no new info");
  } else {
    $.ajax({
      url: `/api/items/${id}`,
      method: 'PUT',
      data: { text_from_user: output, category_id: $('form').find('#catDropDown').val() ? $('form').find('#catDropDown').val() : 0 }
    }).done(() => {
      if ($('form').find('#item-update-field').val() === "") {
        $(`li#${id}`).remove();
      } else if ($('form').find('#catDropDown').val() == 0) {
        let content = $(`li#${id}`).contents()
        content[0] = output;
        $(`li#${id}`).contents().remove();
        for (let i = 0; i < content.length; i++) {
          $(`li#${id}`).append(content[i]);
        }
      } else {
        $(`li#${id}`).val($('form').find('#item-update-field').val())
        $(`li#${id}`).remove();
      }
      $('form').find('#item-update-field').val('');
      $('form').find('#catDropDown').prop('selectedIndex', 0);
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
      $(`li#${id}`).find('.fa-check-square-o').removeClass('green')
      if (state) {
        $(`li#${id}`).find('.fa-check-square-o').addClass('green')
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
var externalLinks = ['https://www.yelp.ca/search?find_desc= ', 'https://www.amazon.ca/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords= ', 'https://www.google.ca/search?q= +showtimes+near+me&rlz=1C5CHFA_enCA785CA785&oq= +showtimes+near+me&aqs=chrome..69i57.9569j0j1&sourceid=chrome&ie=UTF-8', 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dstripbooks&field-keywords= ', 'https://www.google.ca/search?q= &rlz=1C5CHFA_enCA785CA785&oq= &aqs=chrome..69i57j69i60l3j35i39j0.5456j0j7&sourceid=chrome&ie=UTF-8'];

function createItem(item, list, cat) {
  let suggestedURL;
  if (cat === 0 || cat) {
    let str = item.text_from_user;
    let query = str.split(' ').join('+');
    suggestedURL = externalLinks[cat].split(' ').join(query);
  } else {
    let str = item.text_from_user;
    let query = str.split(' ').join('+');
    suggestedURL = externalLinks[externalLinks.length - 1].split(' ').join(query);
  }
  let output = `<li id="${item.id}" class="${cat}">${item.text_from_user}<i class="${item.state ? "green" : ""} modifyItem fa fa-check-square-o"></i><i id="item.id" class="modifyItem fa fa-edit"></i><i id="item.id" class="modifyItem fa fa-minus-square-o"></i><a class="modifyItem fa fa-link" href=${suggestedURL} target="_blank"></a></li>`
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
    createItem(item, list, cat);
  });
}


//clears both lists (just categorized items and for uncategorized the title bars as well)
function clearCatLists() {
  $('#catdTitle').remove();
}
function clearNoneLists() {
  $('#noneTitle').remove();
}