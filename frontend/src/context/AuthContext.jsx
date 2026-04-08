import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const data = localStorage.getItem('usuario');
    if (token && data) setUsuario(JSON.parse(data));
    setCargando(false);
  }, []);

  const login = (token, data) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(data));
    setUsuario(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const actualizarUsuario = (datos) => {
    const nuevo = { ...usuario, ...datos };
    localStorage.setItem('usuario', JSON.stringify(nuevo));
    setUsuario(nuevo);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, actualizarUsuario, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);