

import axios from "axios";

// Sabse pehle check karen ke URL kahan se aa raha hai
const BASE_URL = import.meta.env.VITE_API_URL; 

const api = axios.create({
  // Yahan dhyan den: BASE_URL ke shuru mein https hona lazmi hai
  baseURL: `${BASE_URL}/api`, 
});

// ... baaki code same rahega

// Axios instance for better reusability

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