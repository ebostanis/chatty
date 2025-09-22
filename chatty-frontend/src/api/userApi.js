import api from "./base";

export const updateProfile = (payload) => api.put('/users/profile', payload);

export const deleteAccount = async () => {
    const response = await api.delete('/users/profile');
    return response.status === 204;
}