"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  if(currentUser) {
    putStoriesOnUserPage();
  }
  else {
  putStoriesOnPage();
  }
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
 function returnFav(story) {
  const favorites = currentUser.favorites.map(fav => {return fav.storyId});
  const ID = story.storyId;
  return (favorites.includes(ID) ? true : false);
}

function generateUserStoryMarkup(story) {
  const isFav = returnFav(story);
  let btnClass = "norms"
  let btn = '&#9734;'
  isFav ? btnClass = "favs" : btnClass = "norms"
  isFav ? btn = '&#9733;' : btn = '&#9734;'

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="favorite-btn">
          <button class=${btnClass}>${btn}</button></small>
          <small class="remove-btn"> 
          <button class="remove">remove</button></small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function generateStoryMarkup(story) {
  
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnUserPage() {
  console.debug("putStoriesOnUserPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateUserStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $('.favorite-btn button').on('click', handleFavoritesClick);
  $('button.remove').on('click', handleRemoveClick);
  $allStoriesList.show();
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function getStoryFromID(storyId) {
  let res = await axios.get(`${BASE_URL}/stories/${storyId}`)
  return res.data.story
}


async function createNewStory(evt) {
  const title = $("#new-title").val()
  const author = $("#new-author").val()
  const url = $("#new-url").val()
  let story = await storyList.addStory(currentUser, {title, author, url})
  let $newStory = generateStoryMarkup(story)
  $allStoriesList.append($newStory)
  putStoriesOnPage()
  $newStoryForm.hide()

}

$newStoryForm.on("submit", createNewStory);



async function handleFavoritesClick(evt) {
  if($(evt.target).hasClass("favs")) {
    await currentUser.removeFromFavorites(evt)
    $(evt.target).toggleClass("favs")
  }
  else {
    await currentUser.addToFavorites(evt)
    $(evt.target).toggleClass("favs")
  }
}


async function handleRemoveClick(evt) {
  await currentUser.removeStory(evt)
}

