import { comments, formState } from "./state.js";
import { renderComments } from "./render.js";

export const attachLikeHandlers = () => {
  const container = document.querySelector(".comments");
  const commentInputElement = document.querySelector(".add-form-text");

  if (!container) return;

  // Ensure we don't attach multiple times
  if (container.__delegated) return;
  container.__delegated = true;

  container.addEventListener("click", (event) => {
    const likeBtn = event.target.closest(".like-button");
    if (likeBtn) {
      event.stopPropagation();
      const index = Number(likeBtn.dataset.index);
      const item = comments[index];
      if (!item) return;
      if (item.isLiked) {
        item.isLiked = false;
        item.likes = Math.max(0, item.likes - 1);
      } else {
        item.isLiked = true;
        item.likes = item.likes + 1;
      }
      renderComments();
      return;
    }

    const commentEl = event.target.closest(".comment");
    if (commentEl) {
      const nodes = Array.from(container.querySelectorAll(".comment"));
      const index = nodes.indexOf(commentEl);
      if (index < 0) return;
      const item = comments[index];
      if (!item) return;
      const quotePrefix = "> ";
      const quote = `${quotePrefix}${item.text}\n\n${item.name}, `;
      commentInputElement.value = quote;
      formState.currentCommentValue = quote;
      commentInputElement.focus();
    }
  });
};


