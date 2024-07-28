import api from "@utils/jwtInterceptor.js";
import { API_BACK_BASE_URL } from "@constants/api.js";

export const gradesQuery = async () => {
  const { data } = await api.get(`${API_BACK_BASE_URL}/api/v1/it_grades`, {
    headers: {
      Accept: "application/json",
    },
  });

  return data;
};

export const positionsQuery = async () => {
  const { data } = await api.get(`${API_BACK_BASE_URL}/api/v1/positions`, {
    headers: {
      Accept: "application/json",
    },
  });

  return data;
};

export const tagsQuery = async () => {
  const { data } = await api.get(`${API_BACK_BASE_URL}/api/v1/tags`, {
    headers: {
      Accept: "application/json",
    },
  });

  return data;
};

export const createQuestionQuery = async (params) => {
  const { data } = await api.post(`${API_BACK_BASE_URL}/api/v1/questions`, {
    headers: {
      Accept: "application/json",
    },
    question: params,
  });

  return data;
};
