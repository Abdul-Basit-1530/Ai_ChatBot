// import axios from "axios";

// const API_URL = "http://localhost:5000/api";

// export const askAI = async (prompt, conversationId = null) => {
//   try {
//     const response = await axios.post(`${API_URL}/ai`, { prompt, conversationId });
//     return response.data;
//   } catch (error) {
//     console.error("Error asking AI:", error);
//     throw error;
//   }
// };

// export const getHistory = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/history`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching history:", error);
//     return [];
//   }
// };

// export const getConversation = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/history/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching conversation:", error);
//     throw error;
//   }
// };

// export const deleteConversation = async (id) => {
//   try {
//     await axios.delete(`${API_URL}/history/${id}`);
//     return true;
//   } catch (error) {
//     console.error("Error deleting conversation:", error);
//     return false;
//   }
// };

import axios from "axios";

// Vite automatically reads from .env using import.meta.env
// Agar .env mein kuch nahi milega to ye default localhost use karega
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`;

// Axios instance for better reusability
const api = axios.create({
  baseURL: API_URL,
});

export const askAI = async (prompt, conversationId = null) => {
  try {
    const response = await api.post("/ai", { prompt, conversationId });
    return response.data;
  } catch (error) {
    console.error("Error asking AI:", error);
    throw error;
  }
};


export const getHistory = async () => {
  try {
    const response = await api.get("/history");
    return Array.isArray(response.data) ? response.data : []; // Force array
  } catch (error) {
    console.error("Error fetching history:", error);
    return []; // Return empty array on error
  }
};
export const getConversation = async (id) => {
  try {
    const response = await api.get(`/history/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
};

export const deleteConversation = async (id) => {
  try {
    await api.delete(`/history/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return false;
  }
};