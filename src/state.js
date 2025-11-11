export let comments = [];

export const setComments = (newComments) => {
  comments = newComments;
};

export const formState = {
  currentNameValue: "",
  currentCommentValue: "",
};



export const authState = {
  token: "",
  user: null,
};

export const setAuthState = ({ token, user }) => {
  authState.token = token || "";
  authState.user = user || null;
};


