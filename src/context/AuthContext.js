import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de RESPONSE: Detecta 401 y renueva token
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = sessionStorage.getItem('refresh_token');
            if (!refreshToken) throw new Error("No hay refresh token");

            const res = await axios.post('https://ocean-syt-production.up.railway.app/autenticacion/refrescar', {
              refresh_token: refreshToken,
            });

            const newToken = res.data.access_token;
            sessionStorage.setItem('token', newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Falló la renovación de token:", refreshError);
            logout(); // Cerrar sesión si falla el refresh
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async ({ username, password }) => {
    try {
      const cleanUsername = username.trim();
      const cleanPassword = password.trim();

      const formData = new URLSearchParams();
      formData.append('username', cleanUsername);
      formData.append('password', cleanPassword);

      const response = await axios.post('https://ocean-syt-production.up.railway.app/autenticacion/ingresar', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const decoded = jwtDecode(response.data.access_token);
      const { sub, id, role } = decoded;

      sessionStorage.setItem('token', response.data.access_token);
      sessionStorage.setItem('refresh_token', response.data.refresh_token);
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('userId', id);

      setIsAuthenticated(true);
      setUserName(cleanUsername);
      setUserRole(role);
      setUserId(id);
      setAuthError(null);
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Credenciales inválidas");
    }
  };


  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserName('');
    setUserRole('');
    setUserId('');
    setAuthError(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated,authError,userName,userRole,userId,login,logout,}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


