import api from "./base";

export const fetchChats = () => api.get('/chats');

export const fetchMessages = (chatId) => api.get(`/chats/${chatId}/messages`);

export const sendMessage = (chatId, payload) => api.post(`/chats/${chatId}/messages`, payload);

export const createChat = (payload) => api.post('/chats', payload);
