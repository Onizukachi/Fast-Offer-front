import api from "@utils/jwtInterceptor.js";
import { API_BACK_BASE_URL } from "@constants/api.js";

export const commentsQuery = async (commentableId, commentableType) => {
  const { data } = await api.get(
    `${API_BACK_BASE_URL}/api/v1/comments`,
    {
      headers: {
        Accept: "application/json",
      },
      params: {
        commentable_id: commentableId,
        commentable_type: commentableType,
      },
    },
  );

  return data;
};
