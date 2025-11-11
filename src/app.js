import { comments, formState, setComments, authState, setAuthState } from "./state.js";
import { renderComments } from "./render.js";
import { attachLikeHandlers } from "./handlers.js";
import { getComments, addComment } from "./api.js";
import { loadAuth, clearAuth } from "./storage.js";
import { adaptCommentsFromApi } from "./adapters.js";
import { renderLoginView, renderRegisterView, attachLoginHandlers, attachRegisterHandlers } from "./auth-view.js";
import { renderCommentsView } from "./comments-view.js";

export const initApp = async () => {
  const root = document.getElementById("app");
  let currentView = "comments"; // comments | auth | register

  // Глобальное делегирование для перехода к авторизации
  root?.addEventListener("click", (e) => {
    const authLink = e.target.closest?.(".auth-link");
    if (authLink) {
      e.preventDefault();
      e.stopPropagation();
      currentView = "auth";
      renderApp();
    }
  });

  const restoreAuth = () => {
    const stored = loadAuth();
    if (stored?.token) {
      setAuthState({ token: stored.token, user: stored.user });
    }
  };

  const loadAndRenderComments = async () => {
    try {
      const apiComments = await getComments();
      setComments(adaptCommentsFromApi(apiComments));
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
    renderComments();
    attachLikeHandlers();
  };

  const renderApp = () => {
    if (!root) return;
    if (currentView === "auth") {
      root.innerHTML = renderLoginView();
      attachLoginHandlers(() => {
        currentView = "comments";
        formState.currentCommentValue = "";
        renderApp();
      });
      const toRegisterButton = root.querySelector(".auth-to-register-button");
      toRegisterButton?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentView = "register";
        renderApp();
      });
      return;
    }

    if (currentView === "register") {
      root.innerHTML = renderRegisterView();
      attachRegisterHandlers(() => {
        currentView = "comments";
        formState.currentCommentValue = "";
        renderApp();
      });
      const toLoginButton = root.querySelector(".auth-to-login-button");
      toLoginButton?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentView = "auth";
        renderApp();
      });
      return;
    }

    // comments view
    const isAuthed = Boolean(authState.token);
    const userName = authState.user?.name || "";
    if (isAuthed) {
      formState.currentNameValue = userName;
    } else if (typeof formState.currentNameValue !== "string") {
      formState.currentNameValue = "";
    }
    if (typeof formState.currentCommentValue !== "string") {
      formState.currentCommentValue = "";
    }

    root.innerHTML = renderCommentsView({
      isAuthed,
      userName: formState.currentNameValue,
      commentValue: formState.currentCommentValue,
    });

    // form inputs
    const nameInputElement = root.querySelector(".add-form-name");
    const commentInputElement = root.querySelector(".add-form-text");
    const addButtonElement = root.querySelector(".add-form-button");

    // logout
    const logoutButton = root.querySelector(".logout-button");
    logoutButton?.addEventListener("click", () => {
      clearAuth();
      setAuthState({ token: "", user: null });
      formState.currentNameValue = "";
      formState.currentCommentValue = "";
      currentView = "comments";
      renderApp();
    });

    nameInputElement?.addEventListener("input", (event) => {
      formState.currentNameValue = event.target.value;
    });

    commentInputElement?.addEventListener("input", (event) => {
      formState.currentCommentValue = event.target.value;
    });

    let isSubmitting = false;
    addButtonElement?.addEventListener("click", async () => {
      if (!formState.currentNameValue?.trim() || !formState.currentCommentValue?.trim()) {
        return;
      }
      if (isSubmitting) return;
      isSubmitting = true;
      addButtonElement.disabled = true;

      try {
        await addComment(
          {
            name: formState.currentNameValue.trim(),
            text: formState.currentCommentValue.trim(),
          },
          authState.token
        );

        await loadAndRenderComments();

        const authed = Boolean(authState.token);
        if (authed) {
          const user = authState.user?.name || "";
          formState.currentNameValue = user;
          const nameEl = root.querySelector(".add-form-name");
          if (nameEl) nameEl.value = user;
        } else {
          formState.currentNameValue = "";
          const nameEl = root.querySelector(".add-form-name");
          if (nameEl) nameEl.value = "";
        }
        formState.currentCommentValue = "";
        const textEl = root.querySelector(".add-form-text");
        if (textEl) textEl.value = "";
      } catch (error) {
        console.error("Failed to add comment:", error);
        alert("Не удалось добавить комментарий. Попробуйте еще раз.");
      } finally {
        isSubmitting = false;
        addButtonElement.disabled = false;
      }
    });

    // Render and attach comment list interactions
    renderComments();
    attachLikeHandlers();
  };

  // boot
  restoreAuth();
  renderApp();
  await loadAndRenderComments();
};


