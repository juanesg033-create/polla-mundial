import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function NombreInicial() {
  const [nombre, setNombre] = useState('');
  const [confirmar, setConfirmar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const { actualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const initials = (n) => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleGuardar = async () => {
    const data = await api.actualizarNombre(nombre);
    if (data.error) return;
    setGuardado(true);
    actualizarUsuario({ nombre_display: nombre, nombre_bloqueado: true });
    setTimeout(() => navigate('/'), 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <div style={{ background: '#1D9E75', padding: '12px 16px 16px' }}>
        <h1 style={{ color: '#E1F5EE', fontSize: 16, fontWeight: 600, margin: 0 }}>¡Bienvenido!</h1>
        <p style={{ color: '#9FE1CB', fontSize: 12, margin: '2px 0 0' }}>Sector las Brisas · Mundial 2026</p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div className="alerta alerta-warn">
          <strong>Antes de empezar</strong> — elige el nombre con el que aparecerás en la polla. Solo podrás hacerlo una vez.
        </div>

        {!confirmar && !guardado && (
          <>
            <div className="campo" style={{ marginTop: '1rem' }}>
              <label>Tu nombre en la app</label>
              <input type="text" placeholder="Ej. María Inés" maxLength={30} value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>

            {nombre.length >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fafafa', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#27500A', flexShrink: 0 }}>{initials(nombre)}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{nombre}</p>
                  <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Así aparecerás en la clasificación</p>
                </div>
              </div>
            )}

            <div className="alerta alerta-error">
              Una vez guardado <strong>no podrás cambiarlo</strong>. Si necesitas modificarlo deberás pedírselo al administrador.
            </div>

            <button className="btn-primary" style={{ marginTop: '12px' }} disabled={nombre.length < 2} onClick={() => setConfirmar(true)}>
              Guardar nombre
            </button>
          </>
        )}

        {confirmar && !guardado && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ fontSize: 14, marginBottom: 12 }}>¿Confirmas que quieres llamarte así?</p>
            <div style={{ background: '#EAF3DE', borderRadius: '8px', padding: '10px 20px', display: 'inline-block', marginBottom: '16px' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#1D9E75' }}>{nombre}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-outline" onClick={() => setConfirmar(false)}>Volver</button>
              <button className="btn-primary" onClick={handleGuardar}>Confirmar</button>
            </div>
          </div>
        )}

        {guardado && (
          <div className="alerta alerta-ok" style={{ marginTop: '1rem', textAlign: 'center' }}>
            <strong>{nombre}</strong> guardado. Redirigiendo...
          </div>
        )}
      </div>
    </div>
  );
}