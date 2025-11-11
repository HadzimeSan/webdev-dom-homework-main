import { sanitize } from "./sanitize.js";

export const renderCommentsView = ({ isAuthed, userName, commentValue }) => {
  const safeNameValue = sanitize(userName ?? "");
  const safeCommentValue = sanitize(commentValue ?? "");
  const logoutDisplay = isAuthed ? "block" : "none";
  const authLinkDisplay = isAuthed ? "none" : "block";
  const addFormDisplay = isAuthed ? "block" : "none";
  const readonlyAttr = isAuthed ? 'readonly="readonly"' : "";

  return `
    <div class="logout-container" style="display:${logoutDisplay}">
      <button type="button" class="logout-button">Выйти</button>
    </div>
    <div class="comments-view" style="display:flex">
      <ul class="comments"></ul>
      <div class="auth-link-container" style="display:${authLinkDisplay}">
        <a href="#" class="auth-link">Чтобы добавить комментарий, авторизуйтесь</a>
      </div>
      <div class="add-form" style="display:${addFormDisplay}">
        <input
          type="text"
          class="add-form-name"
          placeholder="Введите ваше имя"
          ${readonlyAttr}
          value="${safeNameValue}"
        />
        <textarea
          type="textarea"
          class="add-form-text"
          placeholder="Введите ваш коментарий"
          rows="4"
        >${safeCommentValue}</textarea>
        <div class="add-form-row">
          <button class="add-form-button">Написать</button>
        </div>
      </div>
    </div>
  `;
};


