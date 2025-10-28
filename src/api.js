const API_BASE_URL = "https://wedev-api.sky.pro/api/v1/ivan-petrov/comments";

export const getComments = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error("Failed to load comments:", error);
    // Return empty array as fallback
    return [];
  }
};

export const addComment = async (comment) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        text: comment.text,
        name: comment.name,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
};
