import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

const BANDERAS = {
  'México':'mx','Sudáfrica':'za','Corea del Sur':'kr','Rep. Checa':'cz',
  'Canadá':'ca','Bosnia y Herzegovina':'ba','Qatar':'qa','Suiza':'ch',
  'Brasil':'br','Marruecos':'ma','Haití':'ht','Escocia':'gb-sct',
  'Estados Unidos':'us','Paraguay':'py','Australia':'au','Turquía':'tr',
  'Alemania':'de','Curazao':'cw','Costa de Marfil':'ci','Ecuador':'ec',
  'Países Bajos':'nl','Japón':'jp','Suecia':'se','Túnez':'tn',
  'Bélgica':'be','Egipto':'eg','Irán':'ir','Nueva Zelanda':'nz',
  'España':'es','Cabo Verde':'cv','Arabia Saudita':'sa','Uruguay':'uy',
  'Francia':'fr','Senegal':'sn','Irak':'iq','Noruega':'no',
  'Austria':'at','Jordania':'jo','Argentina':'ar','Argelia':'dz',
  'Portugal':'pt','RD Congo':'cd','Uzbekistán':'uz','Colombia':'co',
  'Inglaterra':'gb-eng','Croacia':'hr','Ghana':'gh','Panamá':'pa',
};

const fmt = n => '$' + Math.round(n).toLocaleString('es-CO');
const flag = n => BANDERAS[n] ? `https://flagcdn.com/w40/${BANDERAS[n]}.png` : null;

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
  const [confirmar, setConfirmar] = useState(null);
  const [equiposEdit, setEquiposEdit] = useState({});

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

  const eliminarUser = async () => {
    if (!confirmar) return;
    await api.eliminarUsuario(confirmar.id);
    setConfirmar(null);
    api.getUsuarios().then(d => setUsuarios(Array.isArray(d) ? d : []));
    setMsg(`Usuario ${confirmar.nombre} eliminado`);
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

  const actualizarEquipos = async (partido) => {
    const e = equiposEdit[partido.id] || {};
    const local = e.local ?? partido.equipo_local;
    const visita = e.visita ?? partido.equipo_visitante;
    const res = await api.actualizarEquipos(partido.id, local, visita);
    if (res.error) { setMsg('Error: ' + res.error); return; }
    setMsg(`✓ ${local} vs ${visita} actualizado`);
    api.getPartidos().then(d => setPartidos(Array.isArray(d) ? d : []));
    setEquiposEdit(prev => { const n = {...prev}; delete n[partido.id]; return n; });
  };

  const porDefinir = partidos.filter(p =>
    p.equipo_local === 'Por definir' || p.equipo_visitante === 'Por definir'
  );

  return (
    <div>
      {confirmar && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '24px', width: '100%', maxWidth: 320, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>¿Eliminar participante?</h3>
            <p style={{ fontSize: 13, color: '#666', margin: '0 0 20px' }}>Vas a eliminar a <strong>{confirmar.nombre}</strong> y todas sus predicciones. Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmar(null)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #eee', background: '#fafafa', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
              <button onClick={eliminarUser} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#E24B4A', color: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}

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
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          {[['usuarios','Participantes'],['pozo','Pozo'],['resultados','Resultados'],['equipos','Equipos']].map(([k,v]) => (
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
              <button className="btn-outline" style={{ width: 'auto', padding: '6px 14px', fontSize: 12 }} onClick={() => setMostrarForm(!mostrarForm)}>{mostrarForm ? 'Cancelar' : '+ Agregar'}</button>
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
                <button onClick={() => toggleUser(u.id)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #eee', background: '#fafafa', cursor: 'pointer', fontSize: 14 }}>{u.activo ? '🔒' : '✓'}</button>
                <button onClick={() => setConfirmar({ id: u.id, nombre: u.nombre_display })} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #fdd', background: '#fff5f5', cursor: 'pointer', fontSize: 14, color: '#E24B4A' }}>✕</button>
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
            {partidos.filter(p => !p.finalizado && p.equipo_local !== 'Por definir').map(p => (
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
                <button className="btn-primary" style={{ marginTop: 10, fontSize: 12, padding: '9px' }} onClick={() => ingresarResult(p)}>Registrar resultado</button>
              </div>
            ))}
          </>
        )}

        {tab === 'equipos' && (
          <>
            <p style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', fontWeight: 600, margin: '0 0 10px' }}>Definir equipos eliminatorias ({porDefinir.length} partidos)</p>
            {porDefinir.length === 0 && <p style={{ textAlign: 'center', color: '#1D9E75', fontSize: 13 }}>✓ Todos los equipos están definidos</p>}
            {porDefinir.map(p => {
              const e = equiposEdit[p.id] || {};
              const localVal = e.local !== undefined ? e.local : p.equipo_local;
              const visitaVal = e.visita !== undefined ? e.visita : p.equipo_visitante;
              return (
                <div key={p.id} className="card" style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#999', margin: '0 0 10px' }}>{p.grupo} · {new Date(p.fecha_hora).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        {flag(localVal) ? <img src={flag(localVal)} alt={localVal} style={{ width: 24, height: 16, objectFit: 'cover', borderRadius: 2 }} /> : <div style={{ width: 24, height: 16, background: '#eee', borderRadius: 2 }} />}
                        <span style={{ fontSize: 10, color: '#999' }}>Local</span>
                      </div>
                      <input type="text" value={localVal === 'Por definir' ? '' : localVal} placeholder="Equipo local"
                        onChange={e => setEquiposEdit(prev => ({ ...prev, [p.id]: { ...prev[p.id], local: e.target.value } }))}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 12 }} />
                    </div>
                    <span style={{ color: '#ccc', fontWeight: 700, flexShrink: 0 }}>vs</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        {flag(visitaVal) ? <img src={flag(visitaVal)} alt={visitaVal} style={{ width: 24, height: 16, objectFit: 'cover', borderRadius: 2 }} /> : <div style={{ width: 24, height: 16, background: '#eee', borderRadius: 2 }} />}
                        <span style={{ fontSize: 10, color: '#999' }}>Visitante</span>
                      </div>
                      <input type="text" value={visitaVal === 'Por definir' ? '' : visitaVal} placeholder="Equipo visitante"
                        onChange={e => setEquiposEdit(prev => ({ ...prev, [p.id]: { ...prev[p.id], visita: e.target.value } }))}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 12 }} />
                    </div>
                  </div>
                  <button className="btn-primary" style={{ fontSize: 12, padding: '9px' }} onClick={() => actualizarEquipos(p)}>Guardar equipos</button>
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
