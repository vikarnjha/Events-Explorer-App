import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const searchEvents = async (city, page = 0) => {
  const response = await axios.get(API_URL, {
    params: {
      city,
      page,
    },
  });

  return response.data;
};
