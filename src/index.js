"use strict";

import { renderComments } from "./renderComments.js";
import { sanitize } from "./sanitize.js";
import { comments } from "./store/comments.js";
import { attachFormHandlers } from "./handlers.js";

const commentsListElement = document.querySelector(".comments");
const nameInputElement = document.querySelector(".add-form-name");
const commentInputElement = document.querySelector(".add-form-text");
const addButtonElement = document.querySelector(".add-form-button");

let state = {
  currentNameValue: "",
  currentCommentValue: "",
};

function getCurrentDateTimeString() {
  const now = new Date();
  const formatTwoDigits = (number) => String(number).padStart(2, "0");
  const day = formatTwoDigits(now.getDate());
  const month = formatTwoDigits(now.getMonth() + 1);
  const year = String(now.getFullYear()).slice(-2);
  const hours = formatTwoDigits(now.getHours());
  const minutes = formatTwoDigits(now.getMinutes());
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function handleAdd() {
  const name = state.currentNameValue.trim();
  const text = state.currentCommentValue.trim();
  if (!name || !text) return;

  const newComment = {
    name: sanitize(name),
    text: sanitize(text),
    date: getCurrentDateTimeString(),
    likes: 0,
    liked: false,
  };

  comments.push(newComment);
  renderComments(commentsListElement, comments);

  nameInputElement.value = "";
  commentInputElement.value = "";
  state.currentNameValue = "";
  state.currentCommentValue = "";
}

function init() {
  renderComments(commentsListElement, comments);
  attachFormHandlers({
    nameInputElement,
    commentInputElement,
    addButtonElement,
    state,
    onAdd: handleAdd,
  });
}

init();


