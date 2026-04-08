import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Inicio from './pages/Inicio';
import Predicciones from './pages/Predicciones';
import Clasificacion from './pages/Clasificacion';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import NombreInicial from './pages/NombreInicial';
import './App.css';

const RutaProtegida = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="loading">Cargando...</div>;
  return usuario ? children : <Navigate to="/login" />;
};

const RutaAdmin = ({ children }) => {
  const { usuario } = useAuth();
  return usuario?.es_admin ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/predicciones" element={<RutaProtegida><Predicciones /></RutaProtegida>} />
          <Route path="/clasificacion" element={<RutaProtegida><Clasificacion /></RutaProtegida>} />
          <Route path="/perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
          <Route path="/nombre" element={<RutaProtegida><NombreInicial /></RutaProtegida>} />
          <Route path="/admin" element={<RutaProtegida><RutaAdmin><Admin /></RutaAdmin></RutaProtegida>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}