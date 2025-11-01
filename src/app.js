import { comments, formState, setComments, authState, setAuthState } from "./state.js";
import { sanitize } from "./sanitize.js";
import { renderComments } from "./render.js";
import { attachLikeHandlers } from "./handlers.js";
import { getComments, addComment, login, register } from "./api.js";
import { loadAuth, saveAuth, clearAuth } from "./storage.js";
import { adaptCommentsFromApi } from "./adapters.js";

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
    } else {
      showView("comments");
      authLinkContainer.style.display = "block";
      logoutContainer.style.display = "none";
      addFormContainer.style.display = "none";
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

  const nameInputElement = document.querySelector(".add-form-name");
  const commentInputElement = document.querySelector(".add-form-text");
  const addButtonElement = document.querySelector(".add-form-button");

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

      // Clear form
      nameInputElement.value = "";
      commentInputElement.value = "";
      formState.currentNameValue = "";
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

  // AUTH: login/register handlers
  const loginLoginInput = document.querySelector(".auth-login-login");
  const loginPasswordInput = document.querySelector(".auth-login-password");
  const loginButton = document.querySelector(".auth-login-button");
  const regNameInput = document.querySelector(".auth-register-name");
  const regLoginInput = document.querySelector(".auth-register-login");
  const regPasswordInput = document.querySelector(".auth-register-password");
  const regButton = document.querySelector(".auth-register-button");

  if (!loginButton || !loginLoginInput || !loginPasswordInput) {
    console.error("Auth login controls not found in DOM");
  }
  if (!regButton || !regNameInput || !regLoginInput || !regPasswordInput) {
    console.error("Auth register controls not found in DOM");
  }

  let isLoginSubmitting = false;
  loginButton?.addEventListener("click", async () => {
    try {
      const loginValue = loginLoginInput.value.trim();
      const passwordValue = loginPasswordInput.value.trim();
      if (loginValue.length < 3 || passwordValue.length < 3) {
        alert("Логин и пароль должны быть не короче 3 символов");
        return;
      }
      if (isLoginSubmitting) return;
      isLoginSubmitting = true;
      const oldText = loginButton.textContent;
      loginButton.disabled = true;
      loginButton.textContent = "Входим...";
      const res = await login({
        login: loginValue,
        password: passwordValue,
      });
      // normalize possible API shapes
      const token = res.token || res.user?.token || "";
      const user = res.user || null;
      setAuthState({ token, user });
      saveAuth({ token, user });
      updateAuthVisibility();
    } catch (e) {
      alert(`Не удалось войти. ${e?.message || "Проверьте логин и пароль."}`);
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Войти";
      isLoginSubmitting = false;
    }
  });

  let isRegisterSubmitting = false;
  regButton?.addEventListener("click", async () => {
    try {
      const nameValue = regNameInput.value.trim();
      const loginValue = regLoginInput.value.trim();
      const passwordValue = regPasswordInput.value.trim();
      if (nameValue.length < 2 || loginValue.length < 3 || passwordValue.length < 3) {
        alert("Имя ≥ 2 символов, логин/пароль ≥ 3 символов");
        return;
      }
      if (isRegisterSubmitting) return;
      isRegisterSubmitting = true;
      const oldText = regButton.textContent;
      regButton.disabled = true;
      regButton.textContent = "Регистрация...";
      const res = await register({
        login: loginValue,
        password: passwordValue,
        name: nameValue,
      });
      // auto-login after registration
      const token = res.token || res.user?.token || "";
      const user = res.user || null;
      setAuthState({ token, user });
      saveAuth({ token, user });
      updateAuthVisibility();
    } catch (e) {
      alert(`Не удалось зарегистрироваться. ${e?.message || "Попробуйте другие данные."}`);
    } finally {
      regButton.disabled = false;
      regButton.textContent = "Зарегистрироваться";
      isRegisterSubmitting = false;
    }
  });
};


