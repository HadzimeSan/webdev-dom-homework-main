import { comments } from "./state.js";
import { renderComments } from "./render.js";

export const attachLikeHandlers = () => {
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = Number(event.currentTarget.dataset.index);
      const item = comments[index];
      if (item.isLiked) {
        item.isLiked = false;
        item.likes = Math.max(0, item.likes - 1);
      } else {
        item.isLiked = true;
        item.likes = item.likes + 1;
      }
      renderComments();
      attachLikeHandlers();
    });
  });
};


