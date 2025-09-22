import api from "./base";

export const login = (payload) => api.post('/auth/login', payload);

export const signup = (payload) => api.post('/auth/signup', payload);

export const fetchProfile = () => api.get('/users/profile');

