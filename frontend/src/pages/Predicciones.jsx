import { useEffect, useState } from 'react';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

const banderas = {
  'México': 'mx', 'Ecuador': 'ec', 'Estados Unidos': 'us', 'Cuba': 'cu',
  'Argentina': 'ar', 'Islandia': 'is', 'Marruecos': 'ma', 'Irak': 'iq',
  'España': 'es', 'Croacia': 'hr', 'Brasil': 'br', 'Alemania': 'de',
  'Francia': 'fr', 'Colombia': 'co', 'Portugal': 'pt', 'Argelia': 'dz',
  'Inglaterra': 'gb-eng', 'Senegal': 'sn', 'Países Bajos': 'nl',
  'Arabia Saudita': 'sa', 'Uruguay': 'uy', 'Sudáfrica': 'za',
  'Japón': 'jp', 'Australia': 'au', 'Italia': 'it', 'Chile': 'cl',
  'Bélgica': 'be', 'Perú': 'pe', 'Canadá': 'ca', 'Suiza': 'ch',
  'Corea del Sur': 'kr', 'Irán': 'ir', 'Ghana': 'gh', 'Camerún': 'cm',
};

const getBandera = (pais) => {
  const codigo = banderas[pais];
  if (!codigo) return null;
  return `https://flagcdn.com/w40/${codigo}.png`;
};

const getFechaKey = (fecha) => {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

const getHora = (fecha) => {
  const d = new Date(fecha);
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
};

export default function Predicciones() {
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [guardados, setGuardados] = useState({});
  const [tab, setTab] = useState('grupos');
  const [msg, setMsg] = useState({});

  useEffect(() => {
    api.getPartidos().then(d => setPartidos(Array.isArray(d) ? d : []));
    api.misPredicciones().then(d => {
      if (Array.isArray(d)) {
        const mapa = {};
        const gmap = {};
        d.forEach(p => {
          mapa[p.partido_id] = { s1: p.goles_local, s2: p.goles_visitante };
          gmap[p.partido_id] = true;
        });
        setPredicciones(mapa);
        setGuardados(gmap);
      }
    });
  }, []);

  const ahora = new Date();
  const tabs = ['grupos', 'octavos', 'cuartos', 'semis', 'final'];
  const tabLabel = { grupos: 'Grupos', octavos: 'Octavos', cuartos: 'Cuartos', semis: 'Semis', final: 'Final' };

  const partidosFiltrados = partidos.filter(p => {
    if (tab === 'grupos') return p.fase === 'grupos';
    if (tab === 'semis') return p.fase === 'semifinal' || p.fase === 'semis';
    return p.fase === tab;
  });

  // Agrupar por fecha
  const porFecha = partidosFiltrados.reduce((acc, p) => {
    const key = getFechaKey(p.fecha_hora);
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const estadoPartido = (p) => {
    const cierre = new Date(p.cierre_prediccion);
    if (p.finalizado) return 'finalizado';
    if (ahora >= cierre) return 'cerrado';
    if (cierre - ahora < 30 * 60 * 1000) return 'pronto';
    return 'abierto';
  };

  const onChange = (id, team, val) => {
    const v = Math.max(0, Math.min(99, parseInt(val) || 0));
    setPredicciones(prev => ({ ...prev, [id]: { ...prev[id], [team]: v } }));
    setGuardados(prev => ({ ...prev, [id]: false }));
  };

  const guardar = async (p) => {
    const pred = predicciones[p.id] || { s1: 0, s2: 0 };
    const res = await api.guardarPrediccion(p.id, pred.s1, pred.s2);
    if (res.error) { setMsg(prev => ({ ...prev, [p.id]: { tipo: 'error', texto: res.error } })); return; }
    setGuardados(prev => ({ ...prev, [p.id]: true }));
    setMsg(prev => ({ ...prev, [p.id]: { tipo: 'ok', texto: `${p.equipo_local} ${pred.s1} – ${pred.s2} ${p.equipo_visitante}` } }));
  };

  const msRestantes = (p) => {
    const diff = new Date(p.cierre_prediccion) - ahora;
    const min = Math.floor(diff / 60000);
    return `Cierra en ${min} min`;
  };

  const total = partidos.length;
  const preditos = Object.values(guardados).filter(Boolean).length;
  const pct = total > 0 ? Math.round((preditos / total) * 100) : 0;

  return (
    <div>
      <div style={{ background: '#1D9E75', padding: '12px 16px 14px' }}>
        <h1 style={{ color: '#E1F5EE', fontSize: 15, fontWeight: 600, margin: '0 0 2px' }}>Mis predicciones</h1>
        <p style={{ color: '#9FE1CB', fontSize: 12, margin: 0 }}>Sector las Brisas · Mundial 2026</p>
      </div>

      <div style={{ display: 'flex', background: '#0F6E56', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 14px', fontSize: 11, fontWeight: 600, color: tab === t ? '#E1F5EE' : '#9FE1CB', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #E1F5EE' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {tabLabel[t]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#fafafa', borderBottom: '1px solid #eee' }}>
        <span style={{ fontSize: 11, color: '#666', whiteSpace: 'nowrap' }}>{preditos} de {total} guardadas</span>
        <div style={{ flex: 1, height: 4, background: '#eee', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#1D9E75', width: pct + '%', transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 11, color: '#666', whiteSpace: 'nowrap' }}>{pct}%</span>
      </div>

      <div className="contenido">
        {partidosFiltrados.length === 0 && (
          <p style={{ textAlign: 'center', color: '#999', fontSize: 13, padding: '2rem 1rem' }}>Los partidos de esta fase se habilitan cuando avancen los equipos.</p>
        )}

        {Object.entries(porFecha).map(([fecha, partidosDia]) => (
          <div key={fecha}>
            {/* Header de fecha */}
            <div style={{ background: '#f0f7f4', padding: '8px 12px', borderLeft: '4px solid #1D9E75', marginBottom: 8, marginTop: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1D9E75', textTransform: 'capitalize' }}>📅 {fecha}</span>
              <span style={{ fontSize: 11, color: '#999', marginLeft: 8 }}>{partidosDia.length} partido{partidosDia.length > 1 ? 's' : ''}</span>
            </div>

            {partidosDia.map(p => {
              const estado = estadoPartido(p);
              const pred = predicciones[p.id] || { s1: 0, s2: 0 };
              const editando = estado === 'abierto' || estado === 'pronto';
              const m = msg[p.id];
              const banderaLocal = getBandera(p.equipo_local);
              const banderaVisitante = getBandera(p.equipo_visitante);

              return (
                <div key={p.id} className="partido-card">
                  <div className="partido-header">
                    <span className="partido-info">{p.grupo} · {getHora(p.fecha_hora)}</span>
                    {estado === 'abierto' && <span className="badge badge-green">Abierto</span>}
                    {estado === 'pronto' && <span className="badge badge-amber">Cierra pronto</span>}
                    {estado === 'cerrado' && <span className="badge badge-red">En juego</span>}
                    {estado === 'finalizado' && <span className="badge badge-gray">Finalizado</span>}
                  </div>

                  {estado === 'pronto' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: '#854F0B', fontWeight: 600 }}>{msRestantes(p)}</span>
                    </div>
                  )}

                  <div className="equipos-row">
                    <div className="equipo">
                      {banderaLocal && <img src={banderaLocal} alt={p.equipo_local} style={{ width: 32, height: 22, objectFit: 'cover', borderRadius: 3, display: 'block', margin: '0 auto 4px' }} />}
                      <span className="equipo-nombre">{p.equipo_local}</span>
                    </div>
                    <div className="score-wrap">
                      <input className="score-input" type="number" min="0" max="99" value={pred.s1} disabled={!editando} onChange={e => onChange(p.id, 's1', e.target.value)} />
                      <span className="score-dash">—</span>
                      <input className="score-input" type="number" min="0" max="99" value={pred.s2} disabled={!editando} onChange={e => onChange(p.id, 's2', e.target.value)} />
                    </div>
                    <div className="equipo">
                      {banderaVisitante && <img src={banderaVisitante} alt={p.equipo_visitante} style={{ width: 32, height: 22, objectFit: 'cover', borderRadius: 3, display: 'block', margin: '0 auto 4px' }} />}
                      <span className="equipo-nombre">{p.equipo_visitante}</span>
                    </div>
                  </div>

                  {editando && (
                    <button className="btn-primary" style={{ fontSize: 12, padding: '9px', background: guardados[p.id] ? '#fafafa' : '#1D9E75', color: guardados[p.id] ? '#1D9E75' : 'white', border: guardados[p.id] ? '1px solid #1D9E75' : 'none' }} onClick={() => guardar(p)}>
                      {guardados[p.id] ? 'Guardado ✓' : 'Guardar predicción'}
                    </button>
                  )}

                  {m && (
                    <div className={`alerta ${m.tipo === 'ok' ? 'alerta-ok' : 'alerta-error'}`} style={{ marginTop: 8 }}>
                      {m.tipo === 'ok' ? 'Predicción: ' : ''}{m.texto}
                    </div>
                  )}

                  {!editando && estado === 'cerrado' && !guardados[p.id] && (
                    <div style={{ marginTop: 8, textAlign: 'center', background: '#F1EFE8', color: '#5F5E5A', padding: '8px 12px', borderRadius: 8, fontSize: 12 }}>
                      No predijiste a tiempo · 0 puntos
                    </div>
                  )}

                  {estado === 'finalizado' && p.goles_local !== null && (
                    <div className="alerta alerta-ok" style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Resultado real</span>
                      <strong>{p.equipo_local} {p.goles_local} – {p.goles_visitante} {p.equipo_visitante}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <NavBottom />
    </div>
  );
}