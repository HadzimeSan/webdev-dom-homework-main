import { comments, formState, setComments, authState, setAuthState } from "./state.js";
import { sanitize } from "./sanitize.js";
import { renderComments } from "./render.js";
import { attachLikeHandlers } from "./handlers.js";
import { getComments, addComment } from "./api.js";
import { loadAuth, clearAuth } from "./storage.js";
import { adaptCommentsFromApi } from "./adapters.js";
import { attachLoginHandlers, attachRegisterHandlers } from "./auth-view.js";

export const initApp = async () => {
  // restore auth from localStorage
  const stored = loadAuth();
  if (stored?.token) {
    setAuthState({ token: stored.token, user: stored.user });
  }
  // Load comments from API
  try {
    const apiComments = await getComments();
    setComments(adaptCommentsFromApi(apiComments));
  } catch (error) {
    console.error("Failed to load comments:", error);
    // Keep empty array as fallback
  }

  // View management
  const commentsView = document.querySelector(".comments-view");
  const authView = document.querySelector(".auth-view");
  const registerView = document.querySelector(".register-view");
  const authLinkContainer = document.querySelector(".auth-link-container");
  const authLink = document.querySelector(".auth-link");
  const logoutContainer = document.querySelector(".logout-container");
  const logoutButton = document.querySelector(".logout-button");
  const addFormContainer = document.querySelector(".add-form");
  const nameInputElement = document.querySelector(".add-form-name");
  const commentInputElement = document.querySelector(".add-form-text");
  const addButtonElement = document.querySelector(".add-form-button");

  const showView = (viewName) => {
    // Скрываем все view
    commentsView.style.display = "none";
    authView.style.display = "none";
    registerView.style.display = "none";
    
    // Показываем нужный view
    if (viewName === "comments") {
      commentsView.style.display = "flex";
    } else if (viewName === "auth") {
      authView.style.display = "block";
    } else if (viewName === "register") {
      registerView.style.display = "block";
    }
  };

  const updateAuthVisibility = () => {
    const isAuthed = Boolean(authState.token);
    if (isAuthed) {
      showView("comments");
      authLinkContainer.style.display = "none";
      logoutContainer.style.display = "block";
      addFormContainer.style.display = "block";
      // Заполняем имя пользователя из сервера и делаем поле readonly
      const userName = authState.user?.name || "";
      nameInputElement.value = userName;
      nameInputElement.setAttribute("readonly", "readonly");
      formState.currentNameValue = userName;
    } else {
      showView("comments");
      authLinkContainer.style.display = "block";
      logoutContainer.style.display = "none";
      addFormContainer.style.display = "none";
      // Убираем readonly и очищаем поле для неавторизованных
      nameInputElement.removeAttribute("readonly");
      nameInputElement.value = "";
      formState.currentNameValue = "";
    }
  };

  updateAuthVisibility();

  // Ссылка "Авторизуйтесь"
  authLink?.addEventListener("click", (e) => {
    e.preventDefault();
    showView("auth");
  });

  // Кнопка "Выйти"
  logoutButton?.addEventListener("click", () => {
    clearAuth();
    setAuthState({ token: "", user: null });
    updateAuthVisibility();
  });

  // Переключение между входом и регистрацией
  const toRegisterButton = document.querySelector(".auth-to-register-button");
  const toLoginButton = document.querySelector(".auth-to-login-button");

  toRegisterButton?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showView("register");
  });

  toLoginButton?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showView("auth");
  });

  nameInputElement.addEventListener("input", (event) => {
    formState.currentNameValue = event.target.value;
  });

  commentInputElement.addEventListener("input", (event) => {
    formState.currentCommentValue = event.target.value;
  });

  let isSubmitting = false;
  addButtonElement.addEventListener("click", async () => {
    if (!formState.currentNameValue?.trim() || !formState.currentCommentValue?.trim()) {
      return;
    }
    if (isSubmitting) return;
    isSubmitting = true;
    addButtonElement.disabled = true;

    try {
      // Save to API first (API не возвращает полезные данные)
      await addComment({
        name: formState.currentNameValue.trim(),
        text: formState.currentCommentValue.trim(),
      }, authState.token);

      // После успешного POST заново грузим список и адаптируем
      const apiCommentsAfterPost = await getComments();
      setComments(adaptCommentsFromApi(apiCommentsAfterPost));
      renderComments();

      // Clear form, но сохраняем имя если авторизован
      const isAuthed = Boolean(authState.token);
      if (isAuthed) {
        const userName = authState.user?.name || "";
        nameInputElement.value = userName;
        formState.currentNameValue = userName;
      } else {
        nameInputElement.value = "";
        formState.currentNameValue = "";
      }
      commentInputElement.value = "";
      formState.currentCommentValue = "";
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Не удалось добавить комментарий. Попробуйте еще раз.");
    } finally {
      isSubmitting = false;
      addButtonElement.disabled = false;
    }
  });

  renderComments();
  attachLikeHandlers();

  // AUTH: используем отдельный компонент для страницы логина
  attachLoginHandlers(() => {
    updateAuthVisibility();
  });

  attachRegisterHandlers(() => {
    updateAuthVisibility();
  });
};


