import { comments, formState, setComments } from "./state.js";
import { sanitize } from "./sanitize.js";
import { getCurrentDateTimeString } from "./utils.js";
import { renderComments } from "./render.js";
import { attachLikeHandlers } from "./handlers.js";
import { getComments, addComment } from "./api.js";

export const initApp = async () => {
  // Load comments from API
  try {
    const apiComments = await getComments();
    const adapted = apiComments.map((comment) => ({
      // адаптация полей API под рендер
      name: comment.author?.name ?? "",
      text: sanitize(comment.text ?? ""),
      // форматируем дату под UI dd.mm.yy hh:mm
      date: (() => {
        try {
          const d = new Date(comment.date);
          if (Number.isNaN(d.getTime())) return getCurrentDateTimeString();
          const two = (n) => String(n).padStart(2, "0");
          const dd = two(d.getDate());
          const mm = two(d.getMonth() + 1);
          const yy = String(d.getFullYear()).slice(-2);
          const hh = two(d.getHours());
          const min = two(d.getMinutes());
          return `${dd}.${mm}.${yy} ${hh}:${min}`;
        } catch {
          return getCurrentDateTimeString();
        }
      })(),
      likes: comment.likes ?? 0,
      isLiked: Boolean(comment.isLiked),
    }));
    setComments(adapted);
  } catch (error) {
    console.error("Failed to load comments:", error);
    // Keep empty array as fallback
  }
  const nameInputElement = document.querySelector(".add-form-name");
  const commentInputElement = document.querySelector(".add-form-text");
  const addButtonElement = document.querySelector(".add-form-button");

  nameInputElement.addEventListener("input", (event) => {
    formState.currentNameValue = event.target.value;
  });

  commentInputElement.addEventListener("input", (event) => {
    formState.currentCommentValue = event.target.value;
  });

  addButtonElement.addEventListener("click", async () => {
    if (!formState.currentNameValue?.trim() || !formState.currentCommentValue?.trim()) {
      return;
    }

    try {
      // Save to API first (API не возвращает полезные данные)
      await addComment({
        name: formState.currentNameValue.trim(),
        text: formState.currentCommentValue.trim(),
      });

      // После успешного POST заново грузим список и адаптируем
      const apiCommentsAfterPost = await getComments();
      const adapted = apiCommentsAfterPost.map((comment) => ({
        name: comment.author?.name ?? "",
        text: sanitize(comment.text ?? ""),
        date: (() => {
          try {
            const d = new Date(comment.date);
            if (Number.isNaN(d.getTime())) return getCurrentDateTimeString();
            const two = (n) => String(n).padStart(2, "0");
            const dd = two(d.getDate());
            const mm = two(d.getMonth() + 1);
            const yy = String(d.getFullYear()).slice(-2);
            const hh = two(d.getHours());
            const min = two(d.getMinutes());
            return `${dd}.${mm}.${yy} ${hh}:${min}`;
          } catch {
            return getCurrentDateTimeString();
          }
        })(),
        likes: comment.likes ?? 0,
        isLiked: Boolean(comment.isLiked),
      }));
      setComments(adapted);
      renderComments();
      attachLikeHandlers();

      // Clear form
      nameInputElement.value = "";
      commentInputElement.value = "";
      formState.currentNameValue = "";
      formState.currentCommentValue = "";
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Не удалось добавить комментарий. Попробуйте еще раз.");
    }
  });

  renderComments();
  attachLikeHandlers();
};


