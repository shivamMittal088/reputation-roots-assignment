import axios from 'axios';

type ApiRequestOptions = {
  method?: string;
  token?: string;
  body?: unknown;
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000
});

export async function apiRequest(path: string, { method = 'GET', token, body }: ApiRequestOptions = {}) {
  try {
    const response = await apiClient.request({
      url: path,
      method,
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 204) {
      return null;
    }
    throw new Error(error.response?.data?.message || error.message || 'Request failed');
  }
}
