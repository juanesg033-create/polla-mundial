import { useEffect, useState } from 'react';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

// ==================== PARTIDOS FASE DE GRUPOS ====================
const partidosGrupos = [
  // GRUPO A
  { id: 1,  equipo_local: 'México',          equipo_visitante: 'Sudáfrica',       grupo: 'Grupo A', fecha_hora: '2026-06-11T14:00:00', fase: 'grupos' },
  { id: 2,  equipo_local: 'Corea del Sur',   equipo_visitante: 'Rep. Checa',      grupo: 'Grupo A', fecha_hora: '2026-06-11T21:00:00', fase: 'grupos' },
  { id: 3,  equipo_local: 'Rep. Checa',      equipo_visitante: 'Sudáfrica',       grupo: 'Grupo A', fecha_hora: '2026-06-18T11:00:00', fase: 'grupos' },
  { id: 4,  equipo_local: 'México',          equipo_visitante: 'Corea del Sur',   grupo: 'Grupo A', fecha_hora: '2026-06-18T20:00:00', fase: 'grupos' },
  { id: 5,  equipo_local: 'Rep. Checa',      equipo_visitante: 'México',          grupo: 'Grupo A', fecha_hora: '2026-06-24T20:00:00', fase: 'grupos' },
  { id: 6,  equipo_local: 'Sudáfrica',       equipo_visitante: 'Corea del Sur',   grupo: 'Grupo A', fecha_hora: '2026-06-24T20:00:01', fase: 'grupos' },
  // GRUPO B
  { id: 7,  equipo_local: 'Canadá',          equipo_visitante: 'Bosnia y Herz.',  grupo: 'Grupo B', fecha_hora: '2026-06-12T14:00:00', fase: 'grupos' },
  { id: 8,  equipo_local: 'Qatar',           equipo_visitante: 'Suiza',           grupo: 'Grupo B', fecha_hora: '2026-06-13T14:00:00', fase: 'grupos' },
  { id: 9,  equipo_local: 'Suiza',           equipo_visitante: 'Bosnia y Herz.',  grupo: 'Grupo B', fecha_hora: '2026-06-18T14:00:00', fase: 'grupos' },
  { id: 10, equipo_local: 'Canadá',          equipo_visitante: 'Qatar',           grupo: 'Grupo B', fecha_hora: '2026-06-18T17:00:00', fase: 'grupos' },
  { id: 11, equipo_local: 'Suiza',           equipo_visitante: 'Canadá',          grupo: 'Grupo B', fecha_hora: '2026-06-24T14:00:00', fase: 'grupos' },
  { id: 12, equipo_local: 'Bosnia y Herz.',  equipo_visitante: 'Qatar',           grupo: 'Grupo B', fecha_hora: '2026-06-24T14:00:01', fase: 'grupos' },
  // GRUPO C
  { id: 13, equipo_local: 'Brasil',          equipo_visitante: 'Marruecos',       grupo: 'Grupo C', fecha_hora: '2026-06-13T17:00:00', fase: 'grupos' },
  { id: 14, equipo_local: 'Haití',           equipo_visitante: 'Escocia',         grupo: 'Grupo C', fecha_hora: '2026-06-13T20:00:00', fase: 'grupos' },
  { id: 15, equipo_local: 'Escocia',         equipo_visitante: 'Marruecos',       grupo: 'Grupo C', fecha_hora: '2026-06-19T17:00:00', fase: 'grupos' },
  { id: 16, equipo_local: 'Brasil',          equipo_visitante: 'Haití',           grupo: 'Grupo C', fecha_hora: '2026-06-19T20:00:00', fase: 'grupos' },
  { id: 17, equipo_local: 'Brasil',          equipo_visitante: 'Escocia',         grupo: 'Grupo C', fecha_hora: '2026-06-24T17:00:00', fase: 'grupos' },
  { id: 18, equipo_local: 'Marruecos',       equipo_visitante: 'Haití',           grupo: 'Grupo C', fecha_hora: '2026-06-24T17:00:01', fase: 'grupos' },
  // GRUPO D
  { id: 19, equipo_local: 'Estados Unidos',  equipo_visitante: 'Paraguay',        grupo: 'Grupo D', fecha_hora: '2026-06-12T20:00:00', fase: 'grupos' },
  { id: 20, equipo_local: 'Australia',       equipo_visitante: 'Turquía',         grupo: 'Grupo D', fecha_hora: '2026-06-12T23:00:00', fase: 'grupos' },
  { id: 21, equipo_local: 'Turquía',         equipo_visitante: 'Paraguay',        grupo: 'Grupo D', fecha_hora: '2026-06-18T23:00:00', fase: 'grupos' },
  { id: 22, equipo_local: 'Estados Unidos',  equipo_visitante: 'Australia',       grupo: 'Grupo D', fecha_hora: '2026-06-19T14:00:00', fase: 'grupos' },
  { id: 23, equipo_local: 'Turquía',         equipo_visitante: 'Estados Unidos',  grupo: 'Grupo D', fecha_hora: '2026-06-25T21:00:00', fase: 'grupos' },
  { id: 24, equipo_local: 'Paraguay',        equipo_visitante: 'Australia',       grupo: 'Grupo D', fecha_hora: '2026-06-25T21:00:01', fase: 'grupos' },
  // GRUPO E
  { id: 25, equipo_local: 'Alemania',        equipo_visitante: 'Curazao',         grupo: 'Grupo E', fecha_hora: '2026-06-14T12:00:00', fase: 'grupos' },
  { id: 26, equipo_local: 'Costa de Marfil', equipo_visitante: 'Ecuador',         grupo: 'Grupo E', fecha_hora: '2026-06-14T18:00:00', fase: 'grupos' },
  { id: 27, equipo_local: 'Alemania',        equipo_visitante: 'Costa de Marfil', grupo: 'Grupo E', fecha_hora: '2026-06-20T15:00:00', fase: 'grupos' },
  { id: 28, equipo_local: 'Ecuador',         equipo_visitante: 'Curazao',         grupo: 'Grupo E', fecha_hora: '2026-06-20T19:00:00', fase: 'grupos' },
  { id: 29, equipo_local: 'Ecuador',         equipo_visitante: 'Alemania',        grupo: 'Grupo E', fecha_hora: '2026-06-25T15:00:00', fase: 'grupos' },
  { id: 30, equipo_local: 'Curazao',         equipo_visitante: 'Costa de Marfil', grupo: 'Grupo E', fecha_hora: '2026-06-25T15:00:01', fase: 'grupos' },
  // GRUPO F
  { id: 31, equipo_local: 'Países Bajos',    equipo_visitante: 'Japón',           grupo: 'Grupo F', fecha_hora: '2026-06-14T15:00:00', fase: 'grupos' },
  { id: 32, equipo_local: 'Suecia',          equipo_visitante: 'Túnez',           grupo: 'Grupo F', fecha_hora: '2026-06-14T21:00:00', fase: 'grupos' },
  { id: 33, equipo_local: 'Túnez',           equipo_visitante: 'Japón',           grupo: 'Grupo F', fecha_hora: '2026-06-19T23:00:00', fase: 'grupos' },
  { id: 34, equipo_local: 'Países Bajos',    equipo_visitante: 'Suecia',          grupo: 'Grupo F', fecha_hora: '2026-06-20T12:00:00', fase: 'grupos' },
  { id: 35, equipo_local: 'Japón',           equipo_visitante: 'Suecia',          grupo: 'Grupo F', fecha_hora: '2026-06-25T18:00:00', fase: 'grupos' },
  { id: 36, equipo_local: 'Túnez',           equipo_visitante: 'Países Bajos',    grupo: 'Grupo F', fecha_hora: '2026-06-25T18:00:01', fase: 'grupos' },
  // GRUPO G
  { id: 37, equipo_local: 'Bélgica',         equipo_visitante: 'Egipto',          grupo: 'Grupo G', fecha_hora: '2026-06-15T14:00:00', fase: 'grupos' },
  { id: 38, equipo_local: 'Irán',            equipo_visitante: 'Nueva Zelanda',   grupo: 'Grupo G', fecha_hora: '2026-06-15T20:00:00', fase: 'grupos' },
  { id: 39, equipo_local: 'Bélgica',         equipo_visitante: 'Irán',            grupo: 'Grupo G', fecha_hora: '2026-06-21T14:00:00', fase: 'grupos' },
  { id: 40, equipo_local: 'Nueva Zelanda',   equipo_visitante: 'Egipto',          grupo: 'Grupo G', fecha_hora: '2026-06-21T20:00:00', fase: 'grupos' },
  { id: 41, equipo_local: 'Egipto',          equipo_visitante: 'Irán',            grupo: 'Grupo G', fecha_hora: '2026-06-26T22:00:00', fase: 'grupos' },
  { id: 42, equipo_local: 'Nueva Zelanda',   equipo_visitante: 'Bélgica',         grupo: 'Grupo G', fecha_hora: '2026-06-26T22:00:01', fase: 'grupos' },
  // GRUPO H
  { id: 43, equipo_local: 'España',          equipo_visitante: 'Cabo Verde',      grupo: 'Grupo H', fecha_hora: '2026-06-15T11:00:00', fase: 'grupos' },
  { id: 44, equipo_local: 'Arabia Saudita',  equipo_visitante: 'Uruguay',         grupo: 'Grupo H', fecha_hora: '2026-06-15T17:00:00', fase: 'grupos' },
  { id: 45, equipo_local: 'España',          equipo_visitante: 'Arabia Saudita',  grupo: 'Grupo H', fecha_hora: '2026-06-21T11:00:00', fase: 'grupos' },
  { id: 46, equipo_local: 'Uruguay',         equipo_visitante: 'Cabo Verde',      grupo: 'Grupo H', fecha_hora: '2026-06-21T17:00:00', fase: 'grupos' },
  { id: 47, equipo_local: 'Uruguay',         equipo_visitante: 'España',          grupo: 'Grupo H', fecha_hora: '2026-06-26T19:00:00', fase: 'grupos' },
  { id: 48, equipo_local: 'Cabo Verde',      equipo_visitante: 'Arabia Saudita',  grupo: 'Grupo H', fecha_hora: '2026-06-26T19:00:01', fase: 'grupos' },
  // GRUPO I
  { id: 49, equipo_local: 'Francia',         equipo_visitante: 'Senegal',         grupo: 'Grupo I', fecha_hora: '2026-06-16T14:00:00', fase: 'grupos' },
  { id: 50, equipo_local: 'Irak',            equipo_visitante: 'Noruega',         grupo: 'Grupo I', fecha_hora: '2026-06-16T17:00:00', fase: 'grupos' },
  { id: 51, equipo_local: 'Francia',         equipo_visitante: 'Irak',            grupo: 'Grupo I', fecha_hora: '2026-06-22T16:00:00', fase: 'grupos' },
  { id: 52, equipo_local: 'Noruega',         equipo_visitante: 'Senegal',         grupo: 'Grupo I', fecha_hora: '2026-06-22T19:00:00', fase: 'grupos' },
  { id: 53, equipo_local: 'Noruega',         equipo_visitante: 'Francia',         grupo: 'Grupo I', fecha_hora: '2026-06-26T14:00:00', fase: 'grupos' },
  { id: 54, equipo_local: 'Senegal',         equipo_visitante: 'Irak',            grupo: 'Grupo I', fecha_hora: '2026-06-26T14:00:01', fase: 'grupos' },
  // GRUPO J
  { id: 55, equipo_local: 'Austria',         equipo_visitante: 'Jordania',        grupo: 'Grupo J', fecha_hora: '2026-06-15T23:00:00', fase: 'grupos' },
  { id: 56, equipo_local: 'Argentina',       equipo_visitante: 'Argelia',         grupo: 'Grupo J', fecha_hora: '2026-06-16T20:00:00', fase: 'grupos' },
  { id: 57, equipo_local: 'Argentina',       equipo_visitante: 'Austria',         grupo: 'Grupo J', fecha_hora: '2026-06-22T12:00:00', fase: 'grupos' },
  { id: 58, equipo_local: 'Jordania',        equipo_visitante: 'Argelia',         grupo: 'Grupo J', fecha_hora: '2026-06-22T22:00:00', fase: 'grupos' },
  { id: 59, equipo_local: 'Jordania',        equipo_visitante: 'Argentina',       grupo: 'Grupo J', fecha_hora: '2026-06-27T21:00:00', fase: 'grupos' },
  { id: 60, equipo_local: 'Argelia',         equipo_visitante: 'Austria',         grupo: 'Grupo J', fecha_hora: '2026-06-27T21:00:01', fase: 'grupos' },
  // GRUPO K
  { id: 61, equipo_local: 'Portugal',        equipo_visitante: 'RD Congo',        grupo: 'Grupo K', fecha_hora: '2026-06-17T12:00:00', fase: 'grupos' },
  { id: 62, equipo_local: 'Uzbekistán',      equipo_visitante: 'Colombia',        grupo: 'Grupo K', fecha_hora: '2026-06-17T21:00:00', fase: 'grupos' },
  { id: 63, equipo_local: 'Portugal',        equipo_visitante: 'Uzbekistán',      grupo: 'Grupo K', fecha_hora: '2026-06-23T12:00:00', fase: 'grupos' },
  { id: 64, equipo_local: 'Colombia',        equipo_visitante: 'RD Congo',        grupo: 'Grupo K', fecha_hora: '2026-06-23T21:00:00', fase: 'grupos' },
  { id: 65, equipo_local: 'Colombia',        equipo_visitante: 'Portugal',        grupo: 'Grupo K', fecha_hora: '2026-06-27T18:30:00', fase: 'grupos' },
  { id: 66, equipo_local: 'RD Congo',        equipo_visitante: 'Uzbekistán',      grupo: 'Grupo K', fecha_hora: '2026-06-27T18:30:01', fase: 'grupos' },
  // GRUPO L
  { id: 67, equipo_local: 'Inglaterra',      equipo_visitante: 'Croacia',         grupo: 'Grupo L', fecha_hora: '2026-06-17T15:00:00', fase: 'grupos' },
  { id: 68, equipo_local: 'Ghana',           equipo_visitante: 'Panamá',          grupo: 'Grupo L', fecha_hora: '2026-06-17T18:00:00', fase: 'grupos' },
  { id: 69, equipo_local: 'Inglaterra',      equipo_visitante: 'Ghana',           grupo: 'Grupo L', fecha_hora: '2026-06-23T15:00:00', fase: 'grupos' },
  { id: 70, equipo_local: 'Panamá',          equipo_visitante: 'Croacia',         grupo: 'Grupo L', fecha_hora: '2026-06-23T18:00:00', fase: 'grupos' },
  { id: 71, equipo_local: 'Panamá',          equipo_visitante: 'Inglaterra',      grupo: 'Grupo L', fecha_hora: '2026-06-27T16:00:00', fase: 'grupos' },
  { id: 72, equipo_local: 'Croacia',         equipo_visitante: 'Ghana',           grupo: 'Grupo L', fecha_hora: '2026-06-27T16:00:01', fase: 'grupos' },
];

const generarFase = (fase, cantidad, fechaBase, idInicio) =>
  Array.from({ length: cantidad }, (_, i) => ({
    id: idInicio + i,
    equipo_local: 'Por definir', equipo_visitante: 'Por definir',
    grupo: fase, fecha_hora: fechaBase, fase,
  }));

const todosPartidos = [
  ...partidosGrupos,
  ...generarFase('16avos',  16, '2026-06-28T00:00:00', 101),
  ...generarFase('octavos',  8, '2026-07-04T00:00:00', 201),
  ...generarFase('cuartos',  4, '2026-07-09T00:00:00', 301),
  ...generarFase('semis',    2, '2026-07-14T00:00:00', 401),
  ...generarFase('final',    1, '2026-07-19T00:00:00', 501),
];

// ==================== BANDERAS ====================
const banderas = {
  'México':'mx','Sudáfrica':'za','Corea del Sur':'kr','Rep. Checa':'cz',
  'Canadá':'ca','Bosnia y Herz.':'ba','Qatar':'qa','Suiza':'ch',
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
  new Date(f + 'T12:00:00').toLocaleDateString('es-CO', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

const formatHora = (f) =>
  new Date(f).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });

// ==================== COMPONENTE ====================
export default function Predicciones() {
  const [partidosDB, setPartidosDB] = useState({});
  const [predicciones, setPredicciones] = useState({});
  const [guardados, setGuardados] = useState({});
  const [guardando, setGuardando] = useState({});
  const [tab, setTab] = useState('grupos');

  const tabs = ['grupos','16avos','octavos','cuartos','semis','final'];
  const tabLabel = { grupos:'Grupos', '16avos':'16avos', octavos:'Octavos', cuartos:'Cuartos', semis:'Semis', final:'Final' };

  // Cargar predicciones previas del servidor
  useEffect(() => {
    // Mapear partidos del servidor por nombre (para cruzar con los locales)
    api.getPartidos().then(data => {
      if (Array.isArray(data)) {
        const mapa = {};
        data.forEach(p => {
          const key = `${p.equipo_local}|${p.equipo_visitante}`;
          mapa[key] = p.id;
        });
        setPartidosDB(mapa);
      }
    });

    api.misPredicciones().then(data => {
      if (Array.isArray(data)) {
        const mapa = {};
        const gmap = {};
        data.forEach(p => {
          mapa[p.partido_id] = { s1: p.goles_local, s2: p.goles_visitante };
          gmap[p.partido_id] = true;
        });
        setPredicciones(mapa);
        setGuardados(gmap);
      }
    });
  }, []);

  const onChange = (id, team, value) => {
    const v = Math.max(0, Math.min(99, parseInt(value) || 0));
    setPredicciones(prev => ({ ...prev, [id]: { ...prev[id], [team]: v } }));
    setGuardados(prev => ({ ...prev, [id]: false }));
  };

  const guardar = async (p) => {
    // Buscar el ID real en la DB por nombre de equipos
    const key = `${p.equipo_local}|${p.equipo_visitante}`;
    const partidoId = partidosDB[key];

    if (!partidoId) {
      alert('Partido no encontrado en el servidor');
      return;
    }

    const pred = predicciones[p.id] || { s1: 0, s2: 0 };
    setGuardando(prev => ({ ...prev, [p.id]: true }));

    const res = await api.guardarPrediccion(partidoId, pred.s1, pred.s2);

    setGuardando(prev => ({ ...prev, [p.id]: false }));

    if (res.error) {
      alert('Error: ' + res.error);
      return;
    }

    setGuardados(prev => ({ ...prev, [p.id]: true }));
  };

  const filtrados = todosPartidos
    .filter(p => p.fase === tab)
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

  const porFecha = filtrados.reduce((acc, p) => {
    const key = p.fecha_hora.split('T')[0];
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
            color: tab === t ? '#e0f5ec' : '#7dcfaa',
            background:'none', border:'none', cursor:'pointer',
            borderBottom: tab === t ? '2px solid #3ddc97' : '2px solid transparent',
          }}>
            {tabLabel[t]}
          </button>
        ))}
      </div>

      {/* PARTIDOS */}
      <div style={{ padding:'0 8px' }}>
        {Object.entries(porFecha).map(([fecha, lista]) => (
          <div key={fecha}>
            <div style={{
              background:'#0e3d2a', borderLeft:'4px solid #3ddc97',
              padding:'8px 12px', margin:'12px 0 6px', borderRadius:4,
            }}>
              <span style={{ fontSize:12, fontWeight:700, color:'#3ddc97', textTransform:'capitalize' }}>
                📅 {formatFechaTitulo(fecha)}
              </span>
              <span style={{ fontSize:11, color:'#555', marginLeft:8 }}>
                {lista.length} partido{lista.length > 1 ? 's' : ''}
              </span>
            </div>

            {lista.map(p => {
              const esPorDefinir = p.equipo_local === 'Por definir';
              const pred = predicciones[p.id] || { s1: 0, s2: 0 };
              const yaGuardado = guardados[p.id];
              const cargando = guardando[p.id];
              const bl = getBandera(p.equipo_local);
              const bv = getBandera(p.equipo_visitante);

              return (
                <div key={p.id} style={{
                  background:'#112d45', borderRadius:12,
                  padding:'12px 14px', marginBottom:8,
                  border: '1px solid ' + (yaGuardado ? '#3ddc97' : '#1a4060'),
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <span style={{ fontSize:11, color:'#7dcfaa' }}>
                      {p.grupo} · {formatHora(p.fecha_hora)}
                    </span>
                    {esPorDefinir && (
                      <span style={{ fontSize:10, background:'#1a4060', color:'#7dcfaa', padding:'2px 8px', borderRadius:10 }}>
                        Por definir
                      </span>
                    )}
                    {yaGuardado && !esPorDefinir && (
                      <span style={{ fontSize:10, background:'#0e3d2a', color:'#3ddc97', padding:'2px 8px', borderRadius:10 }}>
                        ✓ Guardado
                      </span>
                    )}
                  </div>

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ flex:1, textAlign:'center' }}>
                      {bl && <img src={bl} alt={p.equipo_local} style={{ width:32, height:22, objectFit:'cover', borderRadius:3, display:'block', margin:'0 auto 4px' }} />}
                      <span style={{ fontSize:12, fontWeight:600 }}>{p.equipo_local}</span>
                    </div>

                    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'0 10px' }}>
                      <input type="number" min="0" max="99"
                        value={pred.s1}
                        disabled={esPorDefinir}
                        onChange={e => onChange(p.id, 's1', e.target.value)}
                        style={{
                          width:40, height:40, textAlign:'center', fontSize:18, fontWeight:700,
                          background: esPorDefinir ? '#0d2137' : '#0e3d2a',
                          color: esPorDefinir ? '#333' : '#3ddc97',
                          border: '2px solid ' + (esPorDefinir ? '#1a4060' : yaGuardado ? '#3ddc97' : '#2a6a50'),
                          borderRadius:8, outline:'none',
                        }}
                      />
                      <span style={{ color:'#555', fontWeight:700 }}>—</span>
                      <input type="number" min="0" max="99"
                        value={pred.s2}
                        disabled={esPorDefinir}
                        onChange={e => onChange(p.id, 's2', e.target.value)}
                        style={{
                          width:40, height:40, textAlign:'center', fontSize:18, fontWeight:700,
                          background: esPorDefinir ? '#0d2137' : '#0e3d2a',
                          color: esPorDefinir ? '#333' : '#3ddc97',
                          border: '2px solid ' + (esPorDefinir ? '#1a4060' : yaGuardado ? '#3ddc97' : '#2a6a50'),
                          borderRadius:8, outline:'none',
                        }}
                      />
                    </div>

                    <div style={{ flex:1, textAlign:'center' }}>
                      {bv && <img src={bv} alt={p.equipo_visitante} style={{ width:32, height:22, objectFit:'cover', borderRadius:3, display:'block', margin:'0 auto 4px' }} />}
                      <span style={{ fontSize:12, fontWeight:600 }}>{p.equipo_visitante}</span>
                    </div>
                  </div>

                  {!esPorDefinir && (
                    <button
                      onClick={() => guardar(p)}
                      disabled={cargando}
                      style={{
                        width:'100%', marginTop:10, padding:'10px',
                        background: yaGuardado ? '#0e3d2a' : '#1a7a55',
                        color: yaGuardado ? '#3ddc97' : '#fff',
                        fontWeight:600, border: yaGuardado ? '1px solid #3ddc97' : 'none',
                        borderRadius:8, cursor: cargando ? 'wait' : 'pointer', fontSize:12,
                        opacity: cargando ? 0.6 : 1,
                      }}
                    >
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
