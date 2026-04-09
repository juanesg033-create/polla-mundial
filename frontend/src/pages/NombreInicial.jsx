import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const AVATARES = [
  { seed: 'colombia', emoji: '🇨🇴', label: 'Colombia' },
  { seed: 'brasil', emoji: '🇧🇷', label: 'Brasil' },
  { seed: 'argentina', emoji: '🇦🇷', label: 'Argentina' },
  { seed: 'españa', emoji: '🇪🇸', label: 'España' },
  { seed: 'francia', emoji: '🇫🇷', label: 'Francia' },
  { seed: 'mexico', emoji: '🇲🇽', label: 'México' },
  { seed: 'portugal', emoji: '🇵🇹', label: 'Portugal' },
  { seed: 'alemania', emoji: '🇩🇪', label: 'Alemania' },
  { seed: 'italia', emoji: '🇮🇹', label: 'Italia' },
  { seed: 'inglaterra', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', label: 'Inglaterra' },
  { seed: 'uruguay', emoji: '🇺🇾', label: 'Uruguay' },
  { seed: 'japon', emoji: '🇯🇵', label: 'Japón' },
  { seed: 'paises-bajos', emoji: '🇳🇱', label: 'Países Bajos' },
  { seed: 'estados-unidos', emoji: '🇺🇸', label: 'EE.UU.' },
  { seed: 'chile', emoji: '🇨🇱', label: 'Chile' },
];

export default function NombreInicial() {
  const [nombre, setNombre] = useState('');
  const [avatarElegido, setAvatarElegido] = useState('colombia');
  const [confirmar, setConfirmar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const { actualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const getEmoji = (seed) => AVATARES.find(a => a.seed === seed)?.emoji || '⚽';

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
          <strong>Antes de empezar</strong> — elige tu nombre y tu selección favorita. Solo podrás hacerlo una vez.
        </div>

        {!confirmar && !guardado && (
          <>
            <div className="campo" style={{ marginTop: '1rem' }}>
              <label>Tu nombre en la app</label>
              <input type="text" placeholder="Ej. María Inés" maxLength={30} value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>¿Cuál es tu selección favorita?</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                {AVATARES.map(({ seed, emoji, label }) => (
                  <div key={seed} onClick={() => setAvatarElegido(seed)} style={{ cursor: 'pointer', borderRadius: 12, border: avatarElegido === seed ? '3px solid #1D9E75' : '3px solid #eee', background: avatarElegido === seed ? '#EAF3DE' : '#fafafa', padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 32 }}>{emoji}</span>
                    <span style={{ fontSize: 9, color: '#666', textAlign: 'center', fontWeight: 600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {nombre.length >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fafafa', borderRadius: '8px', padding: '10px 12px', margin: '12px 0' }}>
                <span style={{ fontSize: 36 }}>{getEmoji(avatarElegido)}</span>
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
              Guardar nombre y selección
            </button>
          </>
        )}

        {confirmar && !guardado && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ fontSize: 14, marginBottom: 12 }}>¿Confirmas estos datos?</p>
            <span style={{ fontSize: 64, display: 'block', marginBottom: 8 }}>{getEmoji(avatarElegido)}</span>
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