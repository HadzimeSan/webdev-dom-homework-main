"use strict";

export function attachFormHandlers({
  nameInputElement,
  commentInputElement,
  addButtonElement,
  state,
  onAdd,
}) {
  nameInputElement.addEventListener("input", (event) => {
    state.currentNameValue = event.target.value;
  });

  commentInputElement.addEventListener("input", (event) => {
    state.currentCommentValue = event.target.value;
  });

  addButtonElement.addEventListener("click", () => {
    onAdd();
  });
}


