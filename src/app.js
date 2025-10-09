import { comments, formState } from "./state.js";
import { sanitize } from "./sanitize.js";
import { getCurrentDateTimeString } from "./utils.js";
import { renderComments } from "./render.js";
import { attachLikeHandlers } from "./handlers.js";

export const initApp = () => {
  const nameInputElement = document.querySelector(".add-form-name");
  const commentInputElement = document.querySelector(".add-form-text");
  const addButtonElement = document.querySelector(".add-form-button");

  nameInputElement.addEventListener("input", (event) => {
    formState.currentNameValue = event.target.value;
  });

  commentInputElement.addEventListener("input", (event) => {
    formState.currentCommentValue = event.target.value;
  });

  addButtonElement.addEventListener("click", () => {
    if (!formState.currentNameValue?.trim() || !formState.currentCommentValue?.trim()) {
      return;
    }

    comments.push({
      name: sanitize(formState.currentNameValue.trim()),
      date: getCurrentDateTimeString(),
      text: sanitize(formState.currentCommentValue.trim()),
      likes: 0,
      isLiked: false,
    });

    renderComments();
    attachLikeHandlers();

    nameInputElement.value = "";
    commentInputElement.value = "";
    formState.currentNameValue = "";
    formState.currentCommentValue = "";
  });

  renderComments();
  attachLikeHandlers();
};


