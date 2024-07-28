import api from "@utils/jwtInterceptor.js";
import { API_BACK_BASE_URL } from "@constants/api.js";

export const questionsQuery = async (lastCursor, limit, query) => {
  const { data } = await api.get(`${API_BACK_BASE_URL}/api/v1/questions`, {
    headers: {
      'Accept': 'application/json'
    },
    params: {
      after: lastCursor,
      limit: limit,
      query: query
    }
  });

  return data;
};
