import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const AVATARES = [
  { seed: 'messi', label: 'Messi' },
  { seed: 'ronaldo', label: 'Ronaldo' },
  { seed: 'neymar', label: 'Neymar' },
  { seed: 'mbappe', label: 'Mbappé' },
  { seed: 'haaland', label: 'Haaland' },
  { seed: 'vinicius', label: 'Vinicius' },
  { seed: 'pedri', label: 'Pedri' },
  { seed: 'bellingham', label: 'Bellingham' },
  { seed: 'salah', label: 'Salah' },
  { seed: 'modric', label: 'Modric' },
  { seed: 'colombia', label: 'Colombia' },
  { seed: 'brasil', label: 'Brasil' },
  { seed: 'argentina', label: 'Argentina' },
  { seed: 'españa', label: 'España' },
  { seed: 'francia', label: 'Francia' },
];

const getAvatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&size=80`;

export default function NombreInicial() {
  const [nombre, setNombre] = useState('');
  const [avatarElegido, setAvatarElegido] = useState('messi');
  const [confirmar, setConfirmar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const { actualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const handleGuardar = async () => {
    const data = await api.actualizarNombre(nombre, avatarElegido);
    if (data.error) return;
    setGuardado(true);
    actualizarUsuario({ nombre_display: nombre, nombre_bloqueado: true, avatar: avatarElegido });
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
          <strong>Antes de empezar</strong> — elige tu nombre y avatar. Solo podrás hacerlo una vez.
        </div>

        {!confirmar && !guardado && (
          <>
            <div className="campo" style={{ marginTop: '1rem' }}>
              <label>Tu nombre en la app</label>
              <input type="text" placeholder="Ej. María Inés" maxLength={30} value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Elige tu avatar</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {AVATARES.map(({ seed, label }) => (
                  <div key={seed} onClick={() => setAvatarElegido(seed)} style={{ cursor: 'pointer', borderRadius: 12, border: avatarElegido === seed ? '3px solid #1D9E75' : '3px solid transparent', background: '#f5f5f5', padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <img src={getAvatarUrl(seed)} alt={label} style={{ width: 48, height: 48, borderRadius: 8 }} />
                    <span style={{ fontSize: 9, color: '#666', textAlign: 'center' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {nombre.length >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fafafa', borderRadius: '8px', padding: '10px 12px', margin: '12px 0' }}>
                <img src={getAvatarUrl(avatarElegido)} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{nombre}</p>
                  <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Así aparecerás en la clasificación</p>
                </div>
              </div>
            )}

            <div className="alerta alerta-error">
              Una vez guardado <strong>no podrás cambiarlo</strong>.
            </div>

            <button className="btn-primary" style={{ marginTop: '12px' }} disabled={nombre.length < 2} onClick={() => setConfirmar(true)}>
              Guardar nombre y avatar
            </button>
          </>
        )}

        {confirmar && !guardado && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ fontSize: 14, marginBottom: 12 }}>¿Confirmas que quieres llamarte así?</p>
            <img src={getAvatarUrl(avatarElegido)} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: 8 }} />
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