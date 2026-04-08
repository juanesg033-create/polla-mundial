import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

const fmt = n => '$' + Math.round(n).toLocaleString('es-CO');

export default function Clasificacion() {
  const { usuario } = useAuth();
  const [lista, setLista] = useState([]);
  const [pozo, setPozo] = useState(null);

  useEffect(() => {
    api.clasificacion().then(d => setLista(Array.isArray(d) ? d : []));
    api.getPozo().then(d => setPozo(d));
  }, []);

  const yo = lista.find(u => u.nombre_display === usuario?.nombre_display);

  const posBadgeStyle = (pos) => {
    if (pos === 1) return { background: '#FAEEDA', color: '#633806' };
    if (pos === 2) return { background: '#F1EFE8', color: '#444' };
    if (pos === 3) return { background: '#FAECE7', color: '#712B13' };
    return { background: '#f5f5f5', color: '#888' };
  };

  return (
    <div>
      <div style={{ background: '#1D9E75', padding: '12px 16px 0' }}>
        <div style={{ paddingBottom: '14px' }}>
          <h1 style={{ color: '#E1F5EE', fontSize: 15, fontWeight: 600, margin: '0 0 2px' }}>Tabla de posiciones</h1>
          <p style={{ color: '#9FE1CB', fontSize: 12, margin: 0 }}>Sector las Brisas · Mundial 2026</p>
        </div>
        {pozo && (
          <div className="premios-row">
            <div className="premio-card premio-1">
              <p className="puesto">1er puesto</p>
              <p className="monto">{fmt(pozo.premio_1)}</p>
              <p className="pct">70% del pozo</p>
            </div>
            <div className="premio-card premio-2">
              <p className="puesto">2do puesto</p>
              <p className="monto">{fmt(pozo.premio_2)}</p>
              <p className="pct">20% del pozo</p>
            </div>
            <div className="premio-card premio-3">
              <p className="puesto">3er puesto</p>
              <p className="monto">{fmt(pozo.premio_3)}</p>
              <p className="pct">10% del pozo</p>
            </div>
          </div>
        )}
      </div>

      {yo && (
        <div style={{ background: '#1D9E75', padding: '0 12px 14px' }}>
          <div style={{ background: '#0F6E56', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#27500A' }}>{yo.posicion}</div>
              <div>
                <p style={{ color: '#E1F5EE', fontSize: 14, fontWeight: 600, margin: 0 }}>{yo.nombre_display}</p>
                <p style={{ color: '#9FE1CB', fontSize: 11, margin: 0 }}>Tu posición actual</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#E1F5EE', fontSize: 22, fontWeight: 700, margin: 0 }}>{yo.puntos_total}</p>
              <p style={{ color: '#9FE1CB', fontSize: 10, margin: 0 }}>puntos</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '0 0 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 50px 50px', padding: '6px 16px', borderBottom: '1px solid #eee' }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#999', textTransform: 'uppercase', textAlign: 'center' }}>#</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#999', textTransform: 'uppercase', paddingLeft: 8 }}>Participante</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#999', textTransform: 'uppercase', textAlign: 'center' }}>Pts</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#999', textTransform: 'uppercase', textAlign: 'center' }}>Exactos</span>
        </div>

        {lista.map(u => {
          const esYo = u.nombre_display === usuario?.nombre_display;
          return (
            <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 50px 50px', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #f5f5f5', background: esYo ? '#EAF3DE' : 'white', borderRadius: esYo ? 8 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ ...posBadgeStyle(u.posicion), width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{u.posicion}</div>
              </div>
              <div style={{ paddingLeft: 8 }}>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: esYo ? '#27500A' : '#1a1a1a' }}>{u.nombre_display}{esYo ? ' (tú)' : ''}</p>
                <small style={{ fontSize: 10, color: '#999' }}>{u.exactos} exactos</small>
              </div>
              <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: esYo ? '#27500A' : '#1a1a1a' }}>{u.puntos_total}</div>
              <div style={{ textAlign: 'center', fontSize: 12, color: '#999' }}>{u.exactos}</div>
            </div>
          );
        })}
      </div>
      <NavBottom />
    </div>
  );
}