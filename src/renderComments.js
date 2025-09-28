"use strict";

export function renderComments(container, comments) {
  const commentsHtml = comments
    .map(
      (c) => `
        <li class="comment">
          <div class="comment-header">
            <div>${c.name}</div>
            <div>${c.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              ${c.text}
            </div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${c.likes}</span>
              <button class="like-button${c.liked ? " -active-like" : ""}"></button>
            </div>
          </div>
        </li>`
    )
    .join("");

  container.innerHTML = commentsHtml;
}


