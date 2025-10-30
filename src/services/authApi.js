import axios from 'axios';
import { environment } from '../config/environment';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: `${environment.API_URL}/api/auth`,
  withCredentials: true,
  timeout: 10000,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log('API 요청:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API 함수들
export const authApi = {
  register: (name, email, password) =>
    api.post('/register', { name, email, password }),

  login: (email, password) =>
    api.post('/login', { email, password }),

  logout: () =>
    api.post('/logout'),

  getCurrentUser: () =>
    api.get('/me'),

  getGoogleAuthUrl: () =>
    api.get('/google/url'),

  getNaverAuthUrl: () =>
    api.get('/naver/url'),

  handleOAuthCallback: (provider, code) =>
    api.post(`/${provider}/callback`, { code }),

  admin: {
    getUsers: () => api.get('/admin/users'),
    updateUserType: (userId, userType) =>
      api.put(`/admin/users/${userId}`, { userType }),
    deleteUser: (userId) =>
      api.delete(`/admin/users/${userId}`),
  },
};

export default authApi;
