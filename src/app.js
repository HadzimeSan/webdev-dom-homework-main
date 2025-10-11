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
    // Add local properties for likes functionality
    const commentsWithLikes = apiComments.map(comment => ({
      ...comment,
      likes: 0,
      isLiked: false,
    }));
    setComments(commentsWithLikes);
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

    const newComment = {
      name: sanitize(formState.currentNameValue.trim()),
      text: sanitize(formState.currentCommentValue.trim()),
    };

    try {
      // Save to API first
      const savedComment = await addComment(newComment);
      
      // Add to local state with likes properties
      const commentWithLikes = {
        ...savedComment,
        likes: 0,
        isLiked: false,
      };
      
      comments.push(commentWithLikes);
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


