"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  currentUser ? putStoriesOnUserPage() : putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** When a user clicks on the submit nav button to create a new story */

function navNewStory(evt) {
  console.debug("navNewStory", evt);
  hidePageComponents();
  $newStoryForm.show();
}

$navNewStory.on("click", navNewStory);

function navFavsList(evt) {
  console.debug("navFavsList", evt)
  $allStoriesList.empty();
  const favs = currentUser.favorites
  for(let fav of favs) {
    const story = generateStoryMarkup(fav)
    $allStoriesList.append(story)
  }
}

$navFavorites.on("click", navFavsList);


