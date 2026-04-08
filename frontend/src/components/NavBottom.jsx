import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBottom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useAuth();
  const path = location.pathname;

  return (
    <nav className="nav-bottom">
      <button className={`nav-item ${path === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
        <svg viewBox="0 0 20 20" fill="none"><path d="M3 10L10 3l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><rect x="5" y="10" width="4" height="6" rx="1" fill="currentColor"/><rect x="11" y="10" width="4" height="6" rx="1" fill="currentColor"/></svg>
        Inicio
      </button>
      <button className={`nav-item ${path === '/predicciones' ? 'active' : ''}`} onClick={() => navigate('/predicciones')}>
        <svg viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4V2M13 4V2M3 8h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        Partidos
      </button>
      <button className={`nav-item ${path === '/clasificacion' ? 'active' : ''}`} onClick={() => navigate('/clasificacion')}>
        <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Marcador
      </button>
      <button className={`nav-item ${path === '/perfil' || path === '/admin' ? 'active' : ''}`} onClick={() => navigate(usuario?.es_admin ? '/admin' : '/perfil')}>
        <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M4 17c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        {usuario?.es_admin ? 'Admin' : 'Perfil'}
      </button>
    </nav>
  );
}