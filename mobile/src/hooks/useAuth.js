import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUser } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector(state => state.auth);

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('authUser');
      
      if (storedToken && storedUser) {
        dispatch(updateUser(JSON.parse(storedUser)));
        // Токен автоматически добавляется через axios интерцептор
      }
    } catch (error) {
      console.log('Ошибка загрузки сохраненной аутентификации:', error);
    }
  };

  const saveAuthData = async (userData, authToken) => {
    try {
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('authUser', JSON.stringify(userData));
    } catch (error) {
      console.log('Ошибка сохранения данных аутентификации:', error);
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('authUser');
    } catch (error) {
      console.log('Ошибка очистки данных аутентификации:', error);
    }
  };

  return {
    user,
    token,
    isLoading,
    error,
    saveAuthData,
    clearAuthData,
    isAuthenticated: !!user && !!token
  };
};
