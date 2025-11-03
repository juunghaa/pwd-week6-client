// 기존 api.jsx에서 api 인스턴스를 가져와서 사용
import api from './api';
import { apiUrl } from '../config/environment';

// 서버 URL 설정 (환경별 자동 감지)
const API_BASE_URL = apiUrl;

// 인증 관련 API 함수들
export const authAPIService = {
  // 회원가입
  register: async (userData) => {
    return await api.post('/api/auth/register', userData);
  },

  // 로그인
  login: async (credentials) => {
    return await api.post('/api/auth/login', credentials);
  },

  // 로그아웃
  logout: async () => {
    return await api.post('/api/auth/logout');
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async () => {
    return await api.get('/api/auth/me');
  },

  // OAuth 로그인 URL 생성
  getGoogleLoginUrl: () => `${API_BASE_URL}/api/auth/google`,
  getNaverLoginUrl: () => `${API_BASE_URL}/api/auth/naver`,

  // 관리자 전용 API
  // 모든 사용자 목록 조회
  getAllUsers: async () => {
    return await api.get('/api/users/all');
  },

  // 사용자 유형 변경
  changeUserType: async (userId, userType) => {
    return await api.put(`/api/users/${userId}/type`, { userType });
  },
};

// 기존 api 인스턴스를 authAPI로도 내보내기 (하위 호환성)
export { api as authAPI };

// import axios from 'axios';
// import { environment } from '../config/environment';

// // Axios 인스턴스 생성
// const api = axios.create({
//   baseURL: `${environment.API_URL}/api/auth`,
//   withCredentials: true,
//   timeout: 10000,
// });

// // 요청 인터셉터
// api.interceptors.request.use(
//   (config) => {
//     console.log('API 요청:', config.url);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 응답 인터셉터
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // 인증 관련 API 함수들
// export const authApi = {
//   register: (name, email, password) =>
//     api.post('/register', { name, email, password }),

//   login: (email, password) =>
//     api.post('/login', { email, password }),

//   logout: () =>
//     api.post('/logout'),

//   getCurrentUser: () =>
//     api.get('/me'),

//   getGoogleAuthUrl: () =>
//     api.get('/google/url'),

//   getNaverAuthUrl: () =>
//     api.get('/naver/url'),

//   handleOAuthCallback: (provider, code) =>
//     api.post(`/${provider}/callback`, { code }),

//   admin: {
//     getUsers: () => api.get('/admin/users'),
//     updateUserType: (userId, userType) =>
//       api.put(`/admin/users/${userId}`, { userType }),
//     deleteUser: (userId) =>
//       api.delete(`/admin/users/${userId}`),
//   },
// };

// export default authApi;
