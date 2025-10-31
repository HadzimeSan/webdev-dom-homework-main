import { comments } from "./state.js";

export const renderComments = () => {
  const commentsListElement = document.querySelector(".comments");
  // container-only rendering; interactions handled via delegated handlers

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

  // interactions are attached once via delegation in handlers module
};


