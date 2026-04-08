import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

const fmt = n => '$' + Math.round(n).toLocaleString('es-CO');

export default function Admin() {
  const { usuario, logout } = useAuth();
  const [tab, setTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [pozo, setPozo] = useState(null);
  const [monto, setMonto] = useState('');
  const [partidos, setPartidos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoUsuario, setNuevoUsuario] = useState('');
  const [nuevoPass, setNuevoPass] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [resultados, setResultados] = useState({});

  useEffect(() => {
    api.getUsuarios().then(d => setUsuarios(Array.isArray(d) ? d : []));
    api.getPozo().then(d => { setPozo(d); if (d) setMonto(d.monto_total); });
    api.getPartidos().then(d => setPartidos(Array.isArray(d) ? d : []));
  }, []);

  const initials = (n) => n?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
  const activos = usuarios.filter(u => u.activo && !u.es_admin).length;
  const bloqueados = usuarios.filter(u => !u.activo).length;

  const crearUsuario = async () => {
    if (!nuevoNombre || !nuevoUsuario || !nuevoPass) { setMsg('Completa todos los campos'); return; }
    const res = await api.crearUsuario({ nombre_display: nuevoNombre, usuario: nuevoUsuario, password: nuevoPass });
    if (res.error) { setMsg(res.error); return; }
    setMsg(`Usuario @${nuevoUsuario} creado exitosamente`);
    setNuevoNombre(''); setNuevoUsuario(''); setNuevoPass('');
    setMostrarForm(false);
    api.getUsuarios().then(d => setUsuarios(Array.isArray(d) ? d : []));
  };

  const toggleUser = async (id) => {
    await api.toggleUsuario(id);
    api.getUsuarios().then(d => setUsuarios(Array.isArray(d) ? d : []));
  };

  const eliminarUser = async (id, nombre) => {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return;
    await api.eliminarUsuario(id);
    api.getUsuarios().then(d => setUsuarios(Array.isArray(d) ? d : []));
  };

  const actualizarPozo = async () => {
    const res = await api.actualizarPozo(parseInt(monto));
    if (res.error) { setMsg(res.error); return; }
    setPozo(res); setMsg('Pozo actualizado exitosamente');
  };

  const ingresarResult = async (partido) => {
    const r = resultados[partido.id] || { s1: 0, s2: 0 };
    const res = await api.ingresarResultado(partido.id, r.s1, r.s2);
    if (res.error) { setMsg(res.error); return; }
    setMsg('Resultado ingresado y puntos calculados');
    api.getPartidos().then(d => setPartidos(Array.isArray(d) ? d : []));
  };

  return (
    <div>
      <div style={{ background: '#1D9E75', padding: '12px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#E1F5EE', flexShrink: 0 }}>{initials(usuario?.nombre_display)}</div>
          <div>
            <p style={{ color: '#E1F5EE', fontSize: 15, fontWeight: 600, margin: 0 }}>{usuario?.nombre_display}</p>
            <span style={{ fontSize: 10, background: '#0F6E56', color: '#9FE1CB', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>Administrador</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, paddingBottom: 12 }}>
          {[{ num: usuarios.filter(u => !u.es_admin).length, lbl: 'Participantes' }, { num: activos, lbl: 'Activos' }, { num: bloqueados, lbl: 'Bloqueados' }].map((s, i) => (
            <div key={i} style={{ background: '#0F6E56', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: 18, fontWeight: 700, color: '#E1F5EE' }}>{s.num}</span>
              <span style={{ display: 'block', fontSize: 10, color: '#9FE1CB', marginTop: 1 }}>{s.lbl}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          {[['usuarios','Participantes'],['pozo','Pozo'],['resultados','Resultados']].map(([k,v]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding: '9px 14px', fontSize: 11, fontWeight: 600, color: tab === k ? '#E1F5EE' : '#9FE1CB', background: 'none', border: 'none', borderBottom: tab === k ? '2px solid #E1F5EE' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>{v}</button>
          ))}
        </div>
      </div>

      <div className="contenido">
        {msg && <div className="alerta alerta-ok" style={{ marginBottom: 12 }}>{msg}</div>}

        {tab === 'usuarios' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Usuarios registrados</p>
              <button className="btn-outline" style={{ width: 'auto', padding: '6px 14px', fontSize: 12 }} onClick={() => setMostrarForm(!mostrarForm)}>
                {mostrarForm ? 'Cancelar' : '+ Agregar'}
              </button>
            </div>

            {mostrarForm && (
              <div className="card" style={{ marginBottom: 10, background: '#EEEDFE', border: '1px solid #AFA9EC' }}>
                <div className="campo"><label>Nombre para mostrar en la app</label><input type="text" placeholder="Ej. María Inés Restrepo" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} /></div>
                <div className="campo"><label>Usuario de acceso</label><input type="text" placeholder="Ej. mariaines" value={nuevoUsuario} onChange={e => setNuevoUsuario(e.target.value)} /></div>
                <div className="campo"><label>Contraseña temporal</label><input type="text" placeholder="Ej. brisas123" value={nuevoPass} onChange={e => setNuevoPass(e.target.value)} /></div>
                {nuevoNombre && <div className="alerta alerta-ok" style={{ marginBottom: 8 }}>Así aparecerá: <strong>{nuevoNombre}</strong></div>}
                <button className="btn-primary" onClick={crearUsuario}>Crear participante</button>
              </div>
            )}

            {usuarios.filter(u => !u.es_admin).map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#0C447C', flexShrink: 0 }}>{initials(u.nombre_display)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{u.nombre_display}</p>
                  <p style={{ fontSize: 10, color: '#999', margin: 0 }}>@{u.usuario}</p>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.activo ? '#1D9E75' : '#E24B4A', flexShrink: 0 }} />
                <button onClick={() => toggleUser(u.id)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #eee', background: '#fafafa', cursor: 'pointer', fontSize: 14 }}>
                  {u.activo ? '🔒' : '✓'}
                </button>
                <button onClick={() => eliminarUser(u.id, u.nombre_display)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #eee', background: '#fafafa', cursor: 'pointer', fontSize: 14, color: '#E24B4A' }}>
                  ✕
                </button>
              </div>
            ))}
            <button className="btn-outline" style={{ marginTop: 16 }} onClick={logout}>Cerrar sesión</button>
          </>
        )}

        {tab === 'pozo' && pozo && (
          <div className="card">
            <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px' }}>Actualizar pozo total</p>
            <div className="campo">
              <label>Monto acumulado (COP)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" placeholder="500000" value={monto} onChange={e => setMonto(e.target.value)} style={{ flex: 1 }} />
                <button className="btn-primary" style={{ width: 'auto', padding: '0 16px' }} onClick={actualizarPozo}>Guardar</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 10 }}>
              {[['1er · 70%', fmt(pozo.premio_1)], ['2do · 20%', fmt(pozo.premio_2)], ['3er · 10%', fmt(pozo.premio_3)]].map(([l, v]) => (
                <div key={l} style={{ background: '#fafafa', borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: '#999', margin: '0 0 2px' }}>{l}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'resultados' && (
          <>
            <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 10px' }}>Ingresar resultados</p>
            {partidos.filter(p => !p.finalizado).map(p => (
              <div key={p.id} className="card">
                <p style={{ fontSize: 12, fontWeight: 600, margin: '0 0 10px', color: '#999' }}>{p.grupo} · {new Date(p.fecha_hora).toLocaleDateString('es-CO')}</p>
                <div className="equipos-row">
                  <div className="equipo"><span className="equipo-nombre">{p.equipo_local}</span></div>
                  <div className="score-wrap">
                    <input className="score-input" type="number" min="0" max="99" value={resultados[p.id]?.s1 ?? ''} placeholder="0" onChange={e => setResultados(prev => ({ ...prev, [p.id]: { ...prev[p.id], s1: parseInt(e.target.value) || 0 } }))} />
                    <span className="score-dash">—</span>
                    <input className="score-input" type="number" min="0" max="99" value={resultados[p.id]?.s2 ?? ''} placeholder="0" onChange={e => setResultados(prev => ({ ...prev, [p.id]: { ...prev[p.id], s2: parseInt(e.target.value) || 0 } }))} />
                  </div>
                  <div className="equipo"><span className="equipo-nombre">{p.equipo_visitante}</span></div>
                </div>
                <button className="btn-primary" style={{ marginTop: 10, fontSize: 12, padding: '9px' }} onClick={() => ingresarResult(p)}>
                  Registrar resultado
                </button>
              </div>
            ))}
            {partidos.filter(p => !p.finalizado).length === 0 && <p style={{ textAlign: 'center', color: '#999', fontSize: 13 }}>No hay partidos pendientes.</p>}
          </>
        )}
      </div>
      <NavBottom />
    </div>
  );
}