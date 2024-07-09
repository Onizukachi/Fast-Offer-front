import api from "@utils/jwtInterceptor.js";
import { API_BACK_BASE_URL } from "@constants/api.js";

export const fetchQuestion = async (id) => {
  const { data } = await api.get(`${API_BACK_BASE_URL}/api/v1/questions/${id}`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  return data;
};
