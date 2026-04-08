import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const [tab, setTab] = useState('resumen');
  const [clasificacion, setClasificacion] = useState([]);
  const [predicciones, setPredicciones] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [especiales, setEspeciales] = useState(null);
  const [campeon, setCampeon] = useState('');
  const [goleador, setGoleador] = useState('');
  const [msgEsp, setMsgEsp] = useState('');

  useEffect(() => {
    api.clasificacion().then(d => setClasificacion(Array.isArray(d) ? d : []));
    api.misPredicciones().then(d => setPredicciones(Array.isArray(d) ? d : []));
    api.getPartidos().then(d => setPartidos(Array.isArray(d) ? d : []));
    api.misEspeciales().then(d => { setEspeciales(d); if (d) { setCampeon(d.campeon || ''); setGoleador(d.goleador || ''); } });
  }, []);

  const initials = (n) => n?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
  const yo = clasificacion.find(u => u.nombre_display === usuario?.nombre_display);
  const ahora = new Date();
  const proximos = partidos.filter(p => !p.finalizado && new Date(p.fecha_hora) > ahora);
  const exactos = predicciones.filter(p => p.puntos_obtenidos === 10).length;
  const ganador = predicciones.filter(p => p.puntos_obtenidos === 6).length;
  const fallados = predicciones.filter(p => p.puntos_obtenidos === 0 && p.finalizado).length;

  const guardarEsp = async () => {
    const res = await api.guardarEspeciales(campeon, goleador);
    setMsgEsp(res.error ? res.error : 'Guardado exitosamente');
    if (!res.error) api.misEspeciales().then(setEspeciales);
  };

  return (
    <div>
      <div style={{ background: '#1D9E75', padding: '12px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '14px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#E1F5EE', flexShrink: 0 }}>{initials(usuario?.nombre_display)}</div>
          <div>
            <p style={{ color: '#E1F5EE', fontSize: 16, fontWeight: 600, margin: 0 }}>{usuario?.nombre_display}</p>
            <p style={{ color: '#9FE1CB', fontSize: 12, margin: 0 }}>@{usuario?.usuario} · Sector las Brisas</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, paddingBottom: 0 }}>
          {[{ num: yo?.puntos_total || 0, lbl: 'Puntos' }, { num: yo ? `${yo.posicion}°` : '—', lbl: 'Posición' }, { num: exactos, lbl: 'Exactos' }].map((s, i) => (
            <div key={i} style={{ background: '#0F6E56', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: 18, fontWeight: 700, color: '#E1F5EE' }}>{s.num}</span>
              <span style={{ display: 'block', fontSize: 10, color: '#9FE1CB', marginTop: 1 }}>{s.lbl}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', overflowX: 'auto', marginTop: 2 }}>
          {[['resumen','Resumen'],['especiales','Especiales'],['historial','Historial'],['proximos','Próximos']].map(([k,v]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding: '9px 12px', fontSize: 11, fontWeight: 600, color: tab === k ? '#E1F5EE' : '#9FE1CB', background: 'none', border: 'none', borderBottom: tab === k ? '2px solid #E1F5EE' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>{v}</button>
          ))}
        </div>
      </div>

      <div className="contenido">
        {tab === 'resumen' && (
          <>
            {yo && (
              <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#27500A' }}>{yo.posicion}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{yo.posicion}° de {clasificacion.length}</p>
                    <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Posición actual</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#1D9E75', margin: 0 }}>{yo.puntos_total}</p>
                  <p style={{ fontSize: 10, color: '#999', margin: 0 }}>puntos</p>
                </div>
              </div>
            )}
            <div className="stats-grid">
              <div className="stat-card"><span className="num" style={{ color: '#1D9E75' }}>{exactos}</span><span className="lbl">Exactos</span></div>
              <div className="stat-card"><span className="num" style={{ color: '#185FA5' }}>{ganador}</span><span className="lbl">Ganador</span></div>
              <div className="stat-card"><span className="num" style={{ color: '#999' }}>{fallados}</span><span className="lbl">Fallados</span></div>
            </div>
            <button className="btn-outline" style={{ marginTop: 8 }} onClick={logout}>Cerrar sesión</button>
          </>
        )}

        {tab === 'especiales' && (
          <div className="card">
            <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px' }}>Predicciones especiales · 40 pts cada una</p>
            {especiales?.bloqueado && <div className="alerta alerta-error" style={{ marginBottom: 12 }}>Estas predicciones ya están bloqueadas</div>}
            <div className="campo"><label>Campeón del torneo</label><input type="text" placeholder="Ej. Colombia" value={campeon} onChange={e => setCampeon(e.target.value)} disabled={especiales?.bloqueado} /></div>
            <div className="campo"><label>Goleador del torneo</label><input type="text" placeholder="Ej. Falcao García" value={goleador} onChange={e => setGoleador(e.target.value)} disabled={especiales?.bloqueado} /></div>
            {!especiales?.bloqueado && <button className="btn-primary" onClick={guardarEsp}>Guardar especiales</button>}
            {msgEsp && <div className={`alerta ${msgEsp.includes('Error') || msgEsp.includes('bloqueado') ? 'alerta-error' : 'alerta-ok'}`} style={{ marginTop: 8 }}>{msgEsp}</div>}
            <div className="alerta alerta-info" style={{ marginTop: 12 }}>Se bloquean automáticamente al inicio del primer partido del Mundial.</div>
          </div>
        )}

        {tab === 'historial' && (
          <>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', margin: '0 0 8px' }}>Partidos jugados · {predicciones.filter(p => p.finalizado).length} de {partidos.length}</p>
            {predicciones.filter(p => p.finalizado).map(p => (
              <div key={p.id} className="card" style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: p.puntos_obtenidos === 10 ? '#EAF3DE' : p.puntos_obtenidos === 6 ? '#E6F1FB' : '#F1EFE8' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.puntos_obtenidos === 10 ? '#3B6D11' : p.puntos_obtenidos === 6 ? '#185FA5' : '#888' }}>{p.puntos_obtenidos}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{p.equipo_local} vs {p.equipo_visitante}</p>
                  <p style={{ fontSize: 11, color: '#999', margin: '2px 0 0' }}>Tu predicción: {p.goles_local}-{p.goles_visitante} · Real: {p.resultado_local}-{p.resultado_visitante}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: p.puntos_obtenidos === 10 ? '#1D9E75' : p.puntos_obtenidos === 6 ? '#185FA5' : '#999' }}>+{p.puntos_obtenidos}</span>
              </div>
            ))}
          </>
        )}

        {tab === 'proximos' && (
          <>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', margin: '0 0 8px' }}>Próximos partidos</p>
            {proximos.map(p => {
              const tienePred = predicciones.some(pr => pr.partido_id === p.id);
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <div style={{ textAlign: 'center', minWidth: 52 }}>
                    <span style={{ display: 'block', fontSize: 10, color: '#999' }}>{new Date(p.fecha_hora).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</span>
                    <span style={{ display: 'block', fontSize: 12, fontWeight: 600 }}>{new Date(p.fecha_hora).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ width: 1, height: 36, background: '#eee', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{p.equipo_local} vs {p.equipo_visitante}</p>
                    <p style={{ fontSize: 10, color: '#999', margin: 0 }}>{p.grupo}</p>
                  </div>
                  <span className={`badge ${tienePred ? 'badge-green' : 'badge-amber'}`}>{tienePred ? 'Predije' : 'Falta'}</span>
                </div>
              );
            })}
          </>
        )}
      </div>
      <NavBottom />
    </div>
  );
}