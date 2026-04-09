import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [verPass, setVerPass] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!usuario || !password) { setError('Completa usuario y contrasena'); return; }
    setCargando(true); setError('');
    const data = await api.login(usuario, password);
    setCargando(false);
    if (data.error) { setError(data.error); return; }
    login(data.token, data.usuario);
    if (!data.usuario.nombre_bloqueado) navigate('/nombre');
    else navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <div style={{
        position: 'relative',
        height: '220px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/preview.png"
          alt="Polla Comunal"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top'
          }}
        />
      </div>

      <div style={{ padding: '1.5rem' }}>
        {error && <div className="alerta alerta-error">{error}</div>}

        <div className="campo">
          <label>Usuario</label>
          <input type="text" placeholder="Tu usuario" value={usuario} onChange={e => setUsuario(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        <div className="campo">
          <label>Contrasena</label>
          <div style={{ position: 'relative' }}>
            <input type={verPass ? 'text' : 'password'} placeholder="..." value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ paddingRight: '50px' }} />
            <button onClick={() => setVerPass(!verPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#1D9E75', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
              {verPass ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        <button className="btn-primary" onClick={handleLogin} disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <div style={{ marginTop: '16px', background: '#EAF3DE', borderRadius: '8px', padding: '10px 12px' }}>
          <p style={{ fontSize: '12px', color: '#3B6D11', margin: 0 }}>Si no tienes usuario, contacta al organizador de la polla en tu sector.</p>
        </div>
      </div>
    </div>
  );
}