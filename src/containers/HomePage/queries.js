import axios from "axios";
import { API_BACK_BASE_URL } from "@constants/api.js";

export const fetchPositions = async () => {
  const { data } = await axios.get(`${API_BACK_BASE_URL}/api/v1/positions`, {
    params: {},
  });

  return data;
};
