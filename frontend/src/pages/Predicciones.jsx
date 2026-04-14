import { useEffect, useState } from 'react';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

const banderas = {
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

const getBandera = (pais) =>
  banderas[pais] ? `https://flagcdn.com/w40/${banderas[pais]}.png` : null;

const formatFechaTitulo = (f) =>
  new Date(f).toLocaleDateString('es-CO', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

const formatHora = (f) =>
  new Date(f).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });

export default function Predicciones() {
  const [partidos, setPartidos]         = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [guardados, setGuardados]       = useState({});
  const [guardando, setGuardando]       = useState({});
  const [tab, setTab]                   = useState('grupos');

  const tabs = ['grupos','16avos','octavos','cuartos','semis','final'];
  const tabLabel = { grupos:'Grupos','16avos':'16avos',octavos:'Octavos',cuartos:'Cuartos',semis:'Semis',final:'Final' };

  useEffect(() => {
    // Cargar partidos del servidor (con sus UUIDs reales)
    api.getPartidos().then(data => {
      if (Array.isArray(data)) setPartidos(data);
    });

    // Cargar predicciones previas del usuario
    api.misPredicciones().then(data => {
      if (Array.isArray(data)) {
        const predMap  = {};
        const guardMap = {};
        data.forEach(p => {
          predMap[p.partido_id]  = { s1: p.goles_local, s2: p.goles_visitante };
          guardMap[p.partido_id] = true;
        });
        setPredicciones(predMap);
        setGuardados(guardMap);
      }
    });
  }, []);

  // onChange usa el UUID real del partido — igual que antes
  const onChange = (id, team, value) => {
    const v = Math.max(0, Math.min(99, parseInt(value) || 0));
    setPredicciones(prev => ({ ...prev, [id]: { ...prev[id], [team]: v } }));
    setGuardados(prev => ({ ...prev, [id]: false }));
  };

  const guardar = async (partido) => {
    const pred = predicciones[partido.id] || { s1: 0, s2: 0 };
    setGuardando(prev => ({ ...prev, [partido.id]: true }));
    const res = await api.guardarPrediccion(partido.id, pred.s1, pred.s2);
    setGuardando(prev => ({ ...prev, [partido.id]: false }));
    if (res.error) { alert('Error: ' + res.error); return; }
    setGuardados(prev => ({ ...prev, [partido.id]: true }));
  };

  const esPorDefinir = (p) => p.equipo_local === 'Por definir';

  const filtrados = partidos
    .filter(p => p.fase === tab)
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

  const porFecha = filtrados.reduce((acc, p) => {
    const key = new Date(p.fecha_hora).toLocaleDateString('es-CO', { year:'numeric', month:'2-digit', day:'2-digit' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div style={{ minHeight:'100vh', background:'#0d2137', color:'#fff', paddingBottom:80 }}>

      {/* HEADER */}
      <div style={{ background:'#1a7a55', padding:'14px 16px' }}>
        <h1 style={{ margin:0, fontSize:16, fontWeight:700, color:'#e0f5ec' }}>Mis predicciones</h1>
        <p style={{ margin:'2px 0 0', fontSize:12, color:'#8fe0c0' }}>Sector las Brisas · Mundial 2026</p>
      </div>

      {/* TABS */}
      <div style={{ display:'flex', background:'#0e5c40', overflowX:'auto' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'10px 14px', fontSize:11, fontWeight:600, whiteSpace:'nowrap',
            color: tab===t ? '#e0f5ec' : '#7dcfaa',
            background:'none', border:'none', cursor:'pointer',
            borderBottom: tab===t ? '2px solid #3ddc97' : '2px solid transparent',
          }}>
            {tabLabel[t]}
          </button>
        ))}
      </div>

      {/* PARTIDOS */}
      <div style={{ padding:'0 8px' }}>

        {partidos.length === 0 && (
          <p style={{ textAlign:'center', color:'#7dcfaa', padding:'2rem', fontSize:13 }}>
            Cargando partidos...
          </p>
        )}

        {Object.entries(porFecha).map(([fecha, lista]) => (
          <div key={fecha}>

            {/* ENCABEZADO FECHA */}
            <div style={{ background:'#0e3d2a', borderLeft:'4px solid #3ddc97', padding:'8px 12px', margin:'12px 0 6px', borderRadius:4 }}>
              <span style={{ fontSize:12, fontWeight:700, color:'#3ddc97', textTransform:'capitalize' }}>
                📅 {formatFechaTitulo(lista[0].fecha_hora)}
              </span>
              <span style={{ fontSize:11, color:'#555', marginLeft:8 }}>
                {lista.length} partido{lista.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* CARDS */}
            {lista.map(p => {
              const porDefinir  = esPorDefinir(p);
              const pred        = predicciones[p.id] || { s1: 0, s2: 0 };
              const yaGuardado  = !!guardados[p.id];
              const cargando    = !!guardando[p.id];
              const bl          = getBandera(p.equipo_local);
              const bv          = getBandera(p.equipo_visitante);

              return (
                <div key={p.id} style={{
                  background:'#112d45', borderRadius:12, padding:'12px 14px', marginBottom:8,
                  border: '1px solid ' + (yaGuardado ? '#3ddc97' : '#1a4060'),
                }}>

                  {/* INFO */}
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <span style={{ fontSize:11, color:'#7dcfaa' }}>
                      {p.grupo} · {formatHora(p.fecha_hora)}
                    </span>
                    {porDefinir && (
                      <span style={{ fontSize:10, background:'#1a4060', color:'#7dcfaa', padding:'2px 8px', borderRadius:10 }}>
                        Por definir
                      </span>
                    )}
                    {yaGuardado && !porDefinir && (
                      <span style={{ fontSize:10, background:'#0e3d2a', color:'#3ddc97', padding:'2px 8px', borderRadius:10 }}>
                        ✓ Guardado
                      </span>
                    )}
                  </div>

                  {/* EQUIPOS + MARCADOR */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>

                    {/* LOCAL */}
                    <div style={{ flex:1, textAlign:'center' }}>
                      {bl && <img src={bl} alt={p.equipo_local} style={{ width:32, height:22, objectFit:'cover', borderRadius:3, display:'block', margin:'0 auto 4px' }} />}
                      <span style={{ fontSize:12, fontWeight:600 }}>{p.equipo_local}</span>
                    </div>

                    {/* INPUTS */}
                    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'0 10px' }}>
                      <input
                        type="number" min="0" max="99"
                        value={pred.s1}
                        disabled={porDefinir}
                        onChange={e => onChange(p.id, 's1', e.target.value)}
                        style={{
                          width:40, height:40, textAlign:'center', fontSize:18, fontWeight:700,
                          background: porDefinir ? '#0d2137' : '#0e3d2a',
                          color: porDefinir ? '#333' : '#3ddc97',
                          border: '2px solid ' + (porDefinir ? '#1a4060' : yaGuardado ? '#3ddc97' : '#2a6a50'),
                          borderRadius:8, outline:'none',
                        }}
                      />
                      <span style={{ color:'#555', fontWeight:700 }}>—</span>
                      <input
                        type="number" min="0" max="99"
                        value={pred.s2}
                        disabled={porDefinir}
                        onChange={e => onChange(p.id, 's2', e.target.value)}
                        style={{
                          width:40, height:40, textAlign:'center', fontSize:18, fontWeight:700,
                          background: porDefinir ? '#0d2137' : '#0e3d2a',
                          color: porDefinir ? '#333' : '#3ddc97',
                          border: '2px solid ' + (porDefinir ? '#1a4060' : yaGuardado ? '#3ddc97' : '#2a6a50'),
                          borderRadius:8, outline:'none',
                        }}
                      />
                    </div>

                    {/* VISITANTE */}
                    <div style={{ flex:1, textAlign:'center' }}>
                      {bv && <img src={bv} alt={p.equipo_visitante} style={{ width:32, height:22, objectFit:'cover', borderRadius:3, display:'block', margin:'0 auto 4px' }} />}
                      <span style={{ fontSize:12, fontWeight:600 }}>{p.equipo_visitante}</span>
                    </div>
                  </div>

                  {/* BOTÓN GUARDAR */}
                  {!porDefinir && (
                    <button
                      onClick={() => guardar(p)}
                      disabled={cargando}
                      style={{
                        width:'100%', marginTop:10, padding:'10px',
                        background: yaGuardado ? '#0e3d2a' : '#1a7a55',
                        color: yaGuardado ? '#3ddc97' : '#fff',
                        fontWeight:600, fontSize:12,
                        border: yaGuardado ? '1px solid #3ddc97' : 'none',
                        borderRadius:8,
                        cursor: cargando ? 'wait' : 'pointer',
                        opacity: cargando ? 0.6 : 1,
                      }}>
                      {cargando ? 'Guardando...' : yaGuardado ? '✓ Guardado' : 'Guardar predicción'}
                    </button>
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
