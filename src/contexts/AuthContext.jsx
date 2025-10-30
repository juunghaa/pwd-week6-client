// // 컴포넌트에서 인증 상태 사용하기
// import { useAuth } from '../contexts/AuthContext';

// function MyComponent() {
//   const { user, isAuthenticated, login, logout, isAdmin } = useAuth();
  
//   if (isAuthenticated) {
//     return (
//       <div>
//         <p>안녕하세요, {user.name}님!</p>
//         {isAdmin() && <p>관리자 권한이 있습니다.</p>}
//         <button onClick={logout}>로그아웃</button>
//       </div>
//     );
//   }
  
//   return <LoginForm />;
// }
// // 맛집 데이터 가져오기
// import { useQuery } from '@tanstack/react-query';
// import { restaurantAPI } from '../services/api';

// function RestaurantList() {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['restaurants'],
//     queryFn: restaurantAPI.getRestaurants,
//     staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
//   });

//   if (isLoading) return <div>로딩 중...</div>;
//   if (error) return <div>에러 발생: {error.message}</div>;

//   return (
//     <div>
//       {data?.data?.map(restaurant => (
//         <RestaurantCard key={restaurant.id} restaurant={restaurant} />
//       ))}
//     </div>
//   );
// }
// import { useState, useEffect } from 'react';

// function RestaurantCard({ restaurant }) {
//   const [liked, setLiked] = useState(false);
//   const [likes, setLikes] = useState(restaurant.likes || 0);

//   // 컴포넌트 마운트 시 로컬스토리지에서 상태 복원
//   useEffect(() => {
//     const likedRestaurants = JSON.parse(
//       localStorage.getItem('likedRestaurants') || '[]'
//     );
//     setLiked(likedRestaurants.includes(restaurant.id));
//   }, [restaurant.id]);

//   const handleLike = () => {
//     const newLikedState = !liked;
//     setLiked(newLikedState);
//     setLikes(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    
//     // 로컬스토리지에 상태 저장
//     const likedRestaurants = JSON.parse(
//       localStorage.getItem('likedRestaurants') || '[]'
//     );
    
//     if (newLikedState) {
//       likedRestaurants.push(restaurant.id);
//     } else {
//       const index = likedRestaurants.indexOf(restaurant.id);
//       if (index > -1) likedRestaurants.splice(index, 1);
//     }
    
//     localStorage.setItem('likedRestaurants', JSON.stringify(likedRestaurants));
//   };

//   return (
//     <div>
//       <h3>{restaurant.name}</h3>
//       <button onClick={handleLike}>
//         {liked ? '❤️' : '🤍'} {likes}
//       </button>
//     </div>
//   );
// }
// import { useForm } from 'react-hook-form';

// function LoginForm() {
//   const { register, handleSubmit, formState: { errors } } = useForm();
  
//   const onSubmit = (data) => {
//     console.log('폼 데이터:', data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <input
//         {...register('email', {
//           required: '이메일은 필수입니다',
//           pattern: {
//             value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//             message: '올바른 이메일 형식이 아닙니다'
//           }
//         })}
//         placeholder="이메일"
//       />
//       {errors.email && <span>{errors.email.message}</span>}
      
//       <input
//         {...register('password', {
//           required: '비밀번호는 필수입니다',
//           minLength: {
//             value: 6,
//             message: '비밀번호는 최소 6자 이상이어야 합니다'
//           }
//         })}
//         type="password"
//         placeholder="비밀번호"
//       />
//       {errors.password && <span>{errors.password.message}</span>}
      
//       <button type="submit">로그인</button>
//     </form>
//   );
// }

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 자동 로그인 상태 확인
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getCurrentUser();
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인
  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    }
  };

  // 회원가입
  const register = async (name, email, password) => {
    try {
      const response = await authApi.register(name, email, password);
      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // 관리자 권한 확인
  const isAdmin = () => {
    return user && user.userType === 'admin';
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    isAdmin,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};