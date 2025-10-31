import { sanitize } from "./sanitize.js";
import { getCurrentDateTimeString } from "./utils.js";

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
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
};

export const adaptCommentsFromApi = (apiComments) =>
  apiComments.map((comment) => ({
    name: comment.author?.name ?? "",
    text: sanitize(comment.text ?? ""),
    date: formatDate(comment.date),
    likes: comment.likes ?? 0,
    isLiked: Boolean(comment.isLiked),
  }));


