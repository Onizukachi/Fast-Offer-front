import api from "@utils/jwtInterceptor.js";
import { API_BACK_BASE_URL } from "@constants/api.js";

export const fetchQuestions = async () => {
  const { data } = await api.get(`${API_BACK_BASE_URL}/api/v1/questions`, {
    params: {},
  });

  return data;
};
