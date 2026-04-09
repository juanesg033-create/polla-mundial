import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const AVATARES = [
  { seed: 'colombia', codigo: 'co', label: 'Colombia' },
  { seed: 'brasil', codigo: 'br', label: 'Brasil' },
  { seed: 'argentina', codigo: 'ar', label: 'Argentina' },
  { seed: 'españa', codigo: 'es', label: 'España' },
  { seed: 'francia', codigo: 'fr', label: 'Francia' },
  { seed: 'mexico', codigo: 'mx', label: 'México' },
  { seed: 'portugal', codigo: 'pt', label: 'Portugal' },
  { seed: 'alemania', codigo: 'de', label: 'Alemania' },
  { seed: 'italia', codigo: 'it', label: 'Italia' },
  { seed: 'inglaterra', codigo: 'gb-eng', label: 'Inglaterra' },
  { seed: 'uruguay', codigo: 'uy', label: 'Uruguay' },
  { seed: 'japon', codigo: 'jp', label: 'Japón' },
  { seed: 'paises-bajos', codigo: 'nl', label: 'Países Bajos' },
  { seed: 'estados-unidos', codigo: 'us', label: 'EE.UU.' },
  { seed: 'chile', codigo: 'cl', label: 'Chile' },
];

const getBandera = (codigo) => `https://flagcdn.com/w80/${codigo}.png`;

export default function NombreInicial() {
  const [nombre, setNombre] = useState('');
  const [avatarElegido, setAvatarElegido] = useState('colombia');
  const [confirmar, setConfirmar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const { actualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const getAvatar = (seed) => AVATARES.find(a => a.seed === seed);

  const handleGuardar = async () => {
    const data = await api.actualizarNombre(nombre, avatarElegido);
    if (data.error) return;
    setGuardado(true);
    actualizarUsuario({ nombre_display: nombre, nombre_bloqueado: true, avatar: avatarElegido });
    setTimeout(() => navigate('/'), 1500);
  };

  const av = getAvatar(avatarElegido);

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
                {AVATARES.map(({ seed, codigo, label }) => (
                  <div key={seed} onClick={() => setAvatarElegido(seed)} style={{ cursor: 'pointer', borderRadius: 12, border: avatarElegido === seed ? '3px solid #1D9E75' : '3px solid #eee', background: avatarElegido === seed ? '#EAF3DE' : '#fafafa', padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <img src={getBandera(codigo)} alt={label} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                    <span style={{ fontSize: 9, color: '#666', textAlign: 'center', fontWeight: 600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {nombre.length >= 2 && av && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fafafa', borderRadius: '8px', padding: '10px 12px', margin: '12px 0' }}>
                <img src={getBandera(av.codigo)} alt={av.label} style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{nombre}</p>
                  <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Hincha de {av.label} · Así aparecerás en la clasificación</p>
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

        {confirmar && !guardado && av && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ fontSize: 14, marginBottom: 12 }}>¿Confirmas estos datos?</p>
            <img src={getBandera(av.codigo)} alt={av.label} style={{ width: 80, height: 53, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
            <div style={{ background: '#EAF3DE', borderRadius: '8px', padding: '10px 20px', display: 'inline-block', marginBottom: '16px' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#1D9E75' }}>{nombre}</span>
              <p style={{ fontSize: 12, color: '#666', margin: '4px 0 0' }}>Hincha de {av.label}</p>
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