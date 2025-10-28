import { comments, formState } from "./state.js";

export const renderComments = () => {
  const commentsListElement = document.querySelector(".comments");
  const commentInputElement = document.querySelector(".add-form-text");

  const itemsHtml = comments
    .map((comment, index) => {
      const likeClass = comment.isLiked ? "like-button -active-like" : "like-button";
      return `
        <li class="comment">
          <div class="comment-header">
            <div>${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${comment.text}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button class="${likeClass}" data-index="${index}"></button>
            </div>
          </div>
        </li>`;
    })
    .join("");

  commentsListElement.innerHTML = itemsHtml;

  // click handlers will be attached by handlers module after render

  // reply on comment click
  document.querySelectorAll(".comment").forEach((commentEl, index) => {
    commentEl.addEventListener("click", () => {
      const item = comments[index];
      const quotePrefix = "> ";
      const quote = `${quotePrefix}${item.text}\n\n${item.name}, `;
      commentInputElement.value = quote;
      formState.currentCommentValue = quote;
      commentInputElement.focus();
    });
  });
};


