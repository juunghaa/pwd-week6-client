import axios from 'axios';
import { environment } from '../config/environment';

// Axios 인스턴스 생성
const authClient = axios.create({
  baseURL: `${environment.API_URL}/api/auth`,
  withCredentials: true, // 쿠키 포함 요청
  timeout: 10000,
});

// 요청 인터셉터 - 쿠키 자동 포함
authClient.interceptors.request.use(
  (config) => {
    // withCredentials: true로 설정되어 있어 쿠키가 자동으로 포함됨
    console.log('API 요청:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 세션 만료 처리
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 세션 만료 시 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API 함수들
export const authApi = {
  // 회원가입
  register: (name, email, password) => 
    authClient.post('/register', { name, email, password }),

  // 로그인
  login: (email, password) => 
    authClient.post('/login', { email, password }),

  // 로그아웃
  logout: () => 
    authClient.post('/logout'),

  // 현재 사용자 정보 조회
  getCurrentUser: () => 
    authClient.get('/me'),

  // Google OAuth 로그인 URL 생성
  getGoogleAuthUrl: () => 
    authClient.get('/google/url'),

  // Naver OAuth 로그인 URL 생성
  getNaverAuthUrl: () => 
    authClient.get('/naver/url'),

  // OAuth 콜백 처리
  handleOAuthCallback: (provider, code) => 
    authClient.post(`/${provider}/callback`, { code }),

  // 관리자 전용 API
  admin: {
    // 모든 사용자 목록 조회
    getUsers: () => 
        authClient.get('/admin/users'),
    
    // 사용자 권한 변경
    updateUserType: (userId, userType) => 
        authClient.put(`/admin/users/${userId}`, { userType }),
    
    // 사용자 삭제
    deleteUser: (userId) => 
        authClient.delete(`/admin/users/${userId}`)
  }
};

export default authApi;