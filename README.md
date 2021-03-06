# Midterm Smart TODO List Project 

Our Smart TODO?TADA! List is built on an express server that handles requests and communication between the database and front-end. SCSS and HTML were used for styling to provide an aesthetic and intuitive web app. The cornerstone piece of the project utilizes an AI's ('Luis') API to determine the category that a list item should be put in. The API is queried and returns levels of confidence for each category, this data is processed by the server and checks for a certain level of confidence in the top scoring category. If it meets this threshold the suggested category is assigned otherwise the item becomes uncategorized which can be edited by the user. List items are persisted through server restarts through the use of a database (postgres). Each list element has the ability to be deleted, editted, or 'completed' at the click of a button. In addition to standard options, a link was added which directs the user to a new tab suggesting a 'call to action' for the user to complete their list item ex: showtimes near you for movies. For movies in particular the imdb api was queried to generate a movie poster/director/actors/plot details in the form of a pop up. Login/Register properly check if user exists or does not exist respectively. And the site tracks the user session through the use of a cookie.

## Main contributors
[Jacob Maarse](https://github.com/maarsej), 
[Michael Rychly](https://github.com/michaelrychly) 

### Prerequisites

All prerequisite software except Node.js is included in the package.json provided. Simply 'npm install' before attempting to run the program.

### Getting Started

Upon cloning this respository simply change your directory to the project folder 'midterm' and run the server.js file in node. Then navigate to http://localhost:8080/ in your browser.

```
npm install
```
```
node server.js
```
### Final Product

A brief overview of the layout of the page:
#### The Landing
!["Screenshot of the landing view"](https://github.com/michaelrychly/midterm/blob/master/docs/Screen%20Shot%202018-04-07%20at%203.46.46%20PM.png?raw=true)

#### Lists
!["Screenshot of the lists dropped"](https://github.com/michaelrychly/midterm/blob/master/docs/Screen%20Shot%202018-04-07%20at%203.47.04%20PM.png?raw=true)

#### Login
!["Screenshot of the login modal"](https://github.com/michaelrychly/midterm/blob/master/docs/Screen%20Shot%202018-04-07%20at%203.47.17%20PM.png?raw=true)

#### Movie details (click on text of a list item in the movie list)
!["Screenshot of the movie details modal"](https://github.com/michaelrychly/midterm/blob/master/docs/Screen%20Shot%202018-04-07%20at%203.48.17%20PM.png?raw=true)
