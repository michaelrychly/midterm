"use strict"; // Start of use strict
/*
Created by: Jacob Maarse and Michael Rychly
Date Created: April 4th, 2018
Last Editted: April 7th, 2018
Purpose: Midterm- Smart TODO List project for lighthouse labs
Function: -Built on express server that handles requests and communication between data base and front-end
          -SCSS and HTML styling to provide an aesthetic and functional web app
          -The keystone piece of the project utilizes an AI's API ('Luis') to determine the category that a list
          item should be put in. The API is queried and returns levels of confidence for each category, this data
          is processed by the server and checks for a certain level of confidence in the top scoring category. If
          it meets this threshold the suggested category is assigned otherwise the item becomes uncategorized which
          can be edited by the user.
          -List items are persisted through server restarts through the use of a database (postgres)
          -Each list element has the ability to be deleted, editted, or 'completed' at the click of a button
          -In addition to standard options a link was added which directs the user to a new tab suggesting a 
          'call to action' for the user to complete their list item ex: showtimes near you for movies
          -For movies in particular an imdb api was used to generate a movie poster/director/actors/plot details 
          in the form of a pop up.
          -Login/Register properly check if user exists or does not exist respectively. And the site tracks the user
          through the use of a cookie on the server side.

*/

var currentTarget;
var oldList;

$(document).ready(function () {

  //Watches for click outside of the modal so that it can close when that click occurs
  $('body').click(function (e) {
    e.stopImmediatePropagation();
    if (!$(event.target).parents('section').length && !$(event.target).is('section')) {
      $(".modal").css('display', '');
    }
  });
  // Watches for button click on one of the major categories (which then generates the list), 
  // this click also initializes listeners inside of the newly created list, such that all 
  // the newly generated buttons are active
  $('.portfolio-item').on('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    clearAndLoadList(this).then(function () {
      $('html, body').animate({
        scrollTop: $("#portfolio").offset().top
      }, 500);
      $('.list-title-bar').off("click", slideList);
      $('.list-title-bar').click(function (e) {
        //Check for edit button clicks which will load appropriate modal
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
        //Check for delete button clicks  
        } else if ($(e.target).hasClass('fa-minus-square-o')) {
          // if the delete button is the target
          e.preventDefault();
          e.stopImmediatePropagation();
          // send request to delete
          let id = $(e.target).parent('li').attr('id');
          deleteItem(id);
        //Check for state button clicks
        } else if ($(e.target).hasClass('fa-check-square-o')) {
          // if the target was the state button
          e.preventDefault();
          e.stopImmediatePropagation();
          //send request to update 'state'
          let id = $(e.target).parent('li').attr('id');
          updateItemState(id);
          $('i .green').parent('li').appendTo('#catdList');
        //Check for link button clicks
        } else if ($(e.target).hasClass('fa-link')) {
          e.stopImmediatePropagation();
        //Check for text clicks (only initialized for movies list (class == 2))
        } else if (e.target.tagName == 'LI') {
          let id = $(e.target).attr('id');
          let targetClass = $(e.target).attr('class');
          if (targetClass == 2) {
            loadDetails(id); // targetClass);
          }
        //If none of the other targets were clicked slide the list
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

  //Watches for new item being submitted
  $('#new-item-form').submit(function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    addItem(this);
    return false;
  });

  //Watches for login button to be clicked on nav bar and creates appropriate modal
  $('#logRegBtn').on('click', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $('#id01').css('display', 'block');
    // watches for submit through the use of the register button
    $('#id01').find('button.register').on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      register().then(() => {
        //Creates listener for newly generated logout button
        $('#logoutBtn').on('click', function (e) {
          logout();
        })
      })
    });
    // watches for submit through the use of the login button
    $('#id01').find('button.login').on('click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      login().then(() => {
        //Creates listener for newly generated logout button
        $('#logoutBtn').on('click', function (e) {
          logout();
        })
      })
    });
  })
});

var categories = ['foods', 'products', 'movies', 'books'];
var intentOptions = ['eat', 'buy', 'watch', 'read'];
var titles = ['Something To eat!', 'Something To Buy!', 'Something To Watch!', 'Something To Read!']

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

function logout() {
  $.ajax({
    url: '/api/users/logout',
    method: 'PUT',
    success: ((res) =>{
      location.reload();
    })
  })
}

function login() {
  return new Promise(function (resolve, reject) {
    if ($('form').find('#username-field').val() === "" || $('form').find('#password-field').val() === "") {
      alert("Cannot Login/Register with an empty item");
    } else {
      $.ajax({
        url: '/api/users/login',
        method: 'PUT',
        data: { username: $('form').find('#username-field').val(), password: $('form').find('#password-field').val() },
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
function editModal(id) {
  //get text from list id for placeholder in form
  let placeHolder = $(`#${id}`).text();
  $('#id02').find('input').attr("placeholder", `${placeHolder}`);
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
        btnIntent = intentOptions[i];
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