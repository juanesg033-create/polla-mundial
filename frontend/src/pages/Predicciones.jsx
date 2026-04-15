import { useEffect, useState } from 'react';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

const PARTIDOS_GRUPOS = [
  { id:1,  local:'México',          visita:'Sudáfrica',            grupo:'Grupo A', fecha:'2026-06-11T14:00:00', fase:'grupos' },
  { id:2,  local:'Corea del Sur',   visita:'Rep. Checa',           grupo:'Grupo A', fecha:'2026-06-11T21:00:00', fase:'grupos' },
  { id:3,  local:'Rep. Checa',      visita:'Sudáfrica',            grupo:'Grupo A', fase:'grupos', fecha:'2026-06-18T11:00:00' },
  { id:4,  local:'México',          visita:'Corea del Sur',        grupo:'Grupo A', fecha:'2026-06-18T20:00:00', fase:'grupos' },
  { id:5,  local:'Rep. Checa',      visita:'México',               grupo:'Grupo A', fecha:'2026-06-24T20:00:00', fase:'grupos' },
  { id:6,  local:'Sudáfrica',       visita:'Corea del Sur',        grupo:'Grupo A', fecha:'2026-06-24T20:00:01', fase:'grupos' },
  { id:7,  local:'Canadá',          visita:'Bosnia y Herzegovina', grupo:'Grupo B', fecha:'2026-06-12T14:00:00', fase:'grupos' },
  { id:8,  local:'Qatar',           visita:'Suiza',                grupo:'Grupo B', fecha:'2026-06-13T14:00:00', fase:'grupos' },
  { id:9,  local:'Suiza',           visita:'Bosnia y Herzegovina', grupo:'Grupo B', fecha:'2026-06-18T14:00:00', fase:'grupos' },
  { id:10, local:'Canadá',          visita:'Qatar',                grupo:'Grupo B', fecha:'2026-06-18T17:00:00', fase:'grupos' },
  { id:11, local:'Suiza',           visita:'Canadá',               grupo:'Grupo B', fecha:'2026-06-24T14:00:00', fase:'grupos' },
  { id:12, local:'Bosnia y Herzegovina', visita:'Qatar',           grupo:'Grupo B', fecha:'2026-06-24T14:00:01', fase:'grupos' },
  { id:13, local:'Brasil',          visita:'Marruecos',            grupo:'Grupo C', fecha:'2026-06-13T17:00:00', fase:'grupos' },
  { id:14, local:'Haití',           visita:'Escocia',              grupo:'Grupo C', fecha:'2026-06-13T20:00:00', fase:'grupos' },
  { id:15, local:'Escocia',         visita:'Marruecos',            grupo:'Grupo C', fecha:'2026-06-19T17:00:00', fase:'grupos' },
  { id:16, local:'Brasil',          visita:'Haití',                grupo:'Grupo C', fecha:'2026-06-19T20:00:00', fase:'grupos' },
  { id:17, local:'Brasil',          visita:'Escocia',              grupo:'Grupo C', fecha:'2026-06-24T17:00:00', fase:'grupos' },
  { id:18, local:'Marruecos',       visita:'Haití',                grupo:'Grupo C', fecha:'2026-06-24T17:00:01', fase:'grupos' },
  { id:19, local:'Estados Unidos',  visita:'Paraguay',             grupo:'Grupo D', fecha:'2026-06-12T20:00:00', fase:'grupos' },
  { id:20, local:'Australia',       visita:'Turquía',              grupo:'Grupo D', fecha:'2026-06-12T23:00:00', fase:'grupos' },
  { id:21, local:'Turquía',         visita:'Paraguay',             grupo:'Grupo D', fecha:'2026-06-18T23:00:00', fase:'grupos' },
  { id:22, local:'Estados Unidos',  visita:'Australia',            grupo:'Grupo D', fecha:'2026-06-19T14:00:00', fase:'grupos' },
  { id:23, local:'Turquía',         visita:'Estados Unidos',       grupo:'Grupo D', fecha:'2026-06-25T21:00:00', fase:'grupos' },
  { id:24, local:'Paraguay',        visita:'Australia',            grupo:'Grupo D', fecha:'2026-06-25T21:00:01', fase:'grupos' },
  { id:25, local:'Alemania',        visita:'Curazao',              grupo:'Grupo E', fecha:'2026-06-14T12:00:00', fase:'grupos' },
  { id:26, local:'Costa de Marfil', visita:'Ecuador',              grupo:'Grupo E', fecha:'2026-06-14T18:00:00', fase:'grupos' },
  { id:27, local:'Alemania',        visita:'Costa de Marfil',      grupo:'Grupo E', fecha:'2026-06-20T15:00:00', fase:'grupos' },
  { id:28, local:'Ecuador',         visita:'Curazao',              grupo:'Grupo E', fecha:'2026-06-20T19:00:00', fase:'grupos' },
  { id:29, local:'Ecuador',         visita:'Alemania',             grupo:'Grupo E', fecha:'2026-06-25T15:00:00', fase:'grupos' },
  { id:30, local:'Curazao',         visita:'Costa de Marfil',      grupo:'Grupo E', fecha:'2026-06-25T15:00:01', fase:'grupos' },
  { id:31, local:'Países Bajos',    visita:'Japón',                grupo:'Grupo F', fecha:'2026-06-14T15:00:00', fase:'grupos' },
  { id:32, local:'Suecia',          visita:'Túnez',                grupo:'Grupo F', fecha:'2026-06-14T21:00:00', fase:'grupos' },
  { id:33, local:'Túnez',           visita:'Japón',                grupo:'Grupo F', fecha:'2026-06-19T23:00:00', fase:'grupos' },
  { id:34, local:'Países Bajos',    visita:'Suecia',               grupo:'Grupo F', fecha:'2026-06-20T12:00:00', fase:'grupos' },
  { id:35, local:'Japón',           visita:'Suecia',               grupo:'Grupo F', fecha:'2026-06-25T18:00:00', fase:'grupos' },
  { id:36, local:'Túnez',           visita:'Países Bajos',         grupo:'Grupo F', fecha:'2026-06-25T18:00:01', fase:'grupos' },
  { id:37, local:'Bélgica',         visita:'Egipto',               grupo:'Grupo G', fecha:'2026-06-15T14:00:00', fase:'grupos' },
  { id:38, local:'Irán',            visita:'Nueva Zelanda',        grupo:'Grupo G', fecha:'2026-06-15T20:00:00', fase:'grupos' },
  { id:39, local:'Bélgica',         visita:'Irán',                 grupo:'Grupo G', fecha:'2026-06-21T14:00:00', fase:'grupos' },
  { id:40, local:'Nueva Zelanda',   visita:'Egipto',               grupo:'Grupo G', fecha:'2026-06-21T20:00:00', fase:'grupos' },
  { id:41, local:'Egipto',          visita:'Irán',                 grupo:'Grupo G', fecha:'2026-06-26T22:00:00', fase:'grupos' },
  { id:42, local:'Nueva Zelanda',   visita:'Bélgica',              grupo:'Grupo G', fecha:'2026-06-26T22:00:01', fase:'grupos' },
  { id:43, local:'España',          visita:'Cabo Verde',           grupo:'Grupo H', fecha:'2026-06-15T11:00:00', fase:'grupos' },
  { id:44, local:'Arabia Saudita',  visita:'Uruguay',              grupo:'Grupo H', fecha:'2026-06-15T17:00:00', fase:'grupos' },
  { id:45, local:'España',          visita:'Arabia Saudita',       grupo:'Grupo H', fecha:'2026-06-21T11:00:00', fase:'grupos' },
  { id:46, local:'Uruguay',         visita:'Cabo Verde',           grupo:'Grupo H', fecha:'2026-06-21T17:00:00', fase:'grupos' },
  { id:47, local:'Uruguay',         visita:'España',               grupo:'Grupo H', fecha:'2026-06-26T19:00:00', fase:'grupos' },
  { id:48, local:'Cabo Verde',      visita:'Arabia Saudita',       grupo:'Grupo H', fecha:'2026-06-26T19:00:01', fase:'grupos' },
  { id:49, local:'Francia',         visita:'Senegal',              grupo:'Grupo I', fecha:'2026-06-16T14:00:00', fase:'grupos' },
  { id:50, local:'Irak',            visita:'Noruega',              grupo:'Grupo I', fecha:'2026-06-16T17:00:00', fase:'grupos' },
  { id:51, local:'Francia',         visita:'Irak',                 grupo:'Grupo I', fecha:'2026-06-22T16:00:00', fase:'grupos' },
  { id:52, local:'Noruega',         visita:'Senegal',              grupo:'Grupo I', fecha:'2026-06-22T19:00:00', fase:'grupos' },
  { id:53, local:'Noruega',         visita:'Francia',              grupo:'Grupo I', fecha:'2026-06-26T14:00:00', fase:'grupos' },
  { id:54, local:'Senegal',         visita:'Irak',                 grupo:'Grupo I', fecha:'2026-06-26T14:00:01', fase:'grupos' },
  { id:55, local:'Austria',         visita:'Jordania',             grupo:'Grupo J', fecha:'2026-06-15T23:00:00', fase:'grupos' },
  { id:56, local:'Argentina',       visita:'Argelia',              grupo:'Grupo J', fecha:'2026-06-16T20:00:00', fase:'grupos' },
  { id:57, local:'Argentina',       visita:'Austria',              grupo:'Grupo J', fecha:'2026-06-22T12:00:00', fase:'grupos' },
  { id:58, local:'Jordania',        visita:'Argelia',              grupo:'Grupo J', fecha:'2026-06-22T22:00:00', fase:'grupos' },
  { id:59, local:'Jordania',        visita:'Argentina',            grupo:'Grupo J', fecha:'2026-06-27T21:00:00', fase:'grupos' },
  { id:60, local:'Argelia',         visita:'Austria',              grupo:'Grupo J', fecha:'2026-06-27T21:00:01', fase:'grupos' },
  { id:61, local:'Portugal',        visita:'RD Congo',             grupo:'Grupo K', fecha:'2026-06-17T12:00:00', fase:'grupos' },
  { id:62, local:'Uzbekistán',      visita:'Colombia',             grupo:'Grupo K', fecha:'2026-06-17T21:00:00', fase:'grupos' },
  { id:63, local:'Portugal',        visita:'Uzbekistán',           grupo:'Grupo K', fecha:'2026-06-23T12:00:00', fase:'grupos' },
  { id:64, local:'Colombia',        visita:'RD Congo',             grupo:'Grupo K', fecha:'2026-06-23T21:00:00', fase:'grupos' },
  { id:65, local:'Colombia',        visita:'Portugal',             grupo:'Grupo K', fecha:'2026-06-27T18:30:00', fase:'grupos' },
  { id:66, local:'RD Congo',        visita:'Uzbekistán',           grupo:'Grupo K', fecha:'2026-06-27T18:30:01', fase:'grupos' },
  { id:67, local:'Inglaterra',      visita:'Croacia',              grupo:'Grupo L', fecha:'2026-06-17T15:00:00', fase:'grupos' },
  { id:68, local:'Ghana',           visita:'Panamá',               grupo:'Grupo L', fecha:'2026-06-17T18:00:00', fase:'grupos' },
  { id:69, local:'Inglaterra',      visita:'Ghana',                grupo:'Grupo L', fecha:'2026-06-23T15:00:00', fase:'grupos' },
  { id:70, local:'Panamá',          visita:'Croacia',              grupo:'Grupo L', fecha:'2026-06-23T18:00:00', fase:'grupos' },
  { id:71, local:'Panamá',          visita:'Inglaterra',           grupo:'Grupo L', fecha:'2026-06-27T16:00:00', fase:'grupos' },
  { id:72, local:'Croacia',         visita:'Ghana',                grupo:'Grupo L', fecha:'2026-06-27T16:00:01', fase:'grupos' },
];

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

const flag = p => BANDERAS[p] ? `https://flagcdn.com/w40/${BANDERAS[p]}.png` : null;
const hora = f => new Date(f).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
const fechaTitulo = f => new Date(f).toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long',year:'numeric'});

export default function Predicciones() {
  const [dbPartidos, setDbPartidos] = useState([]);
  const [preds, setPreds]           = useState({});
  const [guardados, setGuardados]   = useState({});
  const [guardando, setGuardando]   = useState({});
  const [tab, setTab]               = useState('grupos');

  useEffect(() => {
    api.getPartidos().then(d => { if (Array.isArray(d)) setDbPartidos(d); });
    api.misPredicciones().then(d => {
      if (!Array.isArray(d)) return;
      const pm = {}, gm = {};
      d.forEach(p => {
        pm[p.partido_id] = { s1: p.goles_local, s2: p.goles_visitante };
        gm[p.partido_id] = true;
      });
      setPreds(pm); setGuardados(gm);
    });
  }, []);

  // Para grupos: usa array local + busca UUID en DB por nombre
  const getDbId = p => {
    const r = dbPartidos.find(d => d.equipo_local === p.local && d.equipo_visitante === p.visita);
    return r?.id;
  };

  const onChange = (id, team, val) => {
    const v = Math.max(0, Math.min(99, parseInt(val)||0));
    setPreds(prev => ({...prev, [id]: {...prev[id], [team]: v}}));
  };

  const guardar = async p => {
    const dbId = p.dbId || getDbId(p);
    if (!dbId) { alert('Partido no disponible aún'); return; }
    const pred = preds[p.id] || preds[dbId] || {s1:0, s2:0};
    setGuardando(prev => ({...prev, [p.id]: true}));
    const res = await api.guardarPrediccion(dbId, pred.s1, pred.s2);
    setGuardando(prev => ({...prev, [p.id]: false}));
    if (res.error) { alert('Error: ' + res.error); return; }
    setGuardados(prev => ({...prev, [dbId]: true}));
    setPreds(prev => ({...prev, [dbId]: pred, [p.id]: pred}));
  };

  const tabs = ['grupos','16avos','octavos','cuartos','semis','final'];
  const tabLabel = {grupos:'Grupos','16avos':'16avos',octavos:'Octavos',cuartos:'Cuartos',semis:'Semis',final:'Final'};

  // Para eliminatorias: usa dbPartidos directamente
  const getFiltrados = () => {
    if (tab === 'grupos') {
      return PARTIDOS_GRUPOS.sort((a,b) => new Date(a.fecha)-new Date(b.fecha));
    }
    return dbPartidos
      .filter(p => p.fase === tab)
      .sort((a,b) => new Date(a.fecha_hora)-new Date(b.fecha_hora))
      .map(p => ({
        id: p.id,
        dbId: p.id,
        local: p.equipo_local,
        visita: p.equipo_visitante,
        grupo: p.grupo,
        fecha: p.fecha_hora,
        fase: p.fase,
      }));
  };

  const filtrados = getFiltrados();

  const porFecha = filtrados.reduce((acc,p) => {
    const fechaKey = tab === 'grupos' ? p.fecha.split('T')[0] : p.fecha.split('T')[0];
    if (!acc[fechaKey]) acc[fechaKey] = [];
    acc[fechaKey].push(p);
    return acc;
  }, {});

  return (
    <div style={{minHeight:'100vh',background:'#0d2137',color:'#fff',paddingBottom:80}}>
      <div style={{background:'#1a7a55',padding:'14px 16px'}}>
        <h1 style={{margin:0,fontSize:16,fontWeight:700,color:'#e0f5ec'}}>Mis predicciones</h1>
        <p style={{margin:'2px 0 0',fontSize:12,color:'#8fe0c0'}}>Sector las Brisas · Mundial 2026</p>
      </div>

      <div style={{display:'flex',background:'#0e5c40',overflowX:'auto'}}>
        {tabs.map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:'10px 14px',fontSize:11,fontWeight:600,whiteSpace:'nowrap',
            color: tab===t?'#e0f5ec':'#7dcfaa',
            background:'none',border:'none',cursor:'pointer',
            borderBottom: tab===t?'2px solid #3ddc97':'2px solid transparent',
          }}>{tabLabel[t]}</button>
        ))}
      </div>

      <div style={{padding:'0 8px'}}>
        {Object.entries(porFecha).map(([fecha, lista]) => (
          <div key={fecha}>
            <div style={{background:'#0e3d2a',borderLeft:'4px solid #3ddc97',padding:'8px 12px',margin:'12px 0 6px',borderRadius:4}}>
              <span style={{fontSize:12,fontWeight:700,color:'#3ddc97',textTransform:'capitalize'}}>
                📅 {fechaTitulo(fecha+'T12:00:00')}
              </span>
              <span style={{fontSize:11,color:'#555',marginLeft:8}}>{lista.length} partido{lista.length>1?'s':''}</span>
            </div>

            {lista.map(p => {
              const porDefinir = p.local === 'Por definir';
              const dbId = p.dbId || getDbId(p);
              const pred = preds[p.id] || preds[dbId] || {s1:0, s2:0};
              const yaGuardado = !!(guardados[dbId] || guardados[p.id]);
              const cargando = !!guardando[p.id];
              const bl = flag(p.local), bv = flag(p.visita);

              return (
                <div key={p.id} style={{
                  background:'#112d45',borderRadius:12,padding:'12px 14px',marginBottom:8,
                  border:'1px solid '+(yaGuardado?'#3ddc97':'#1a4060'),
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                    <span style={{fontSize:11,color:'#7dcfaa'}}>{p.grupo} · {hora(p.fecha)}</span>
                    {porDefinir && <span style={{fontSize:10,background:'#1a4060',color:'#7dcfaa',padding:'2px 8px',borderRadius:10}}>Por definir</span>}
                    {yaGuardado && !porDefinir && <span style={{fontSize:10,background:'#0e3d2a',color:'#3ddc97',padding:'2px 8px',borderRadius:10}}>✓ Guardado</span>}
                  </div>

                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{flex:1,textAlign:'center'}}>
                      {bl && <img src={bl} alt={p.local} style={{width:32,height:22,objectFit:'cover',borderRadius:3,display:'block',margin:'0 auto 4px'}}/>}
                      <span style={{fontSize:12,fontWeight:600}}>{p.local}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:6,padding:'0 10px'}}>
                      <input type="number" min="0" max="99" value={pred.s1} disabled={porDefinir}
                        onChange={e=>onChange(p.id,'s1',e.target.value)}
                        style={{width:40,height:40,textAlign:'center',fontSize:18,fontWeight:700,
                          background:porDefinir?'#0d2137':'#0e3d2a',
                          color:porDefinir?'#333':'#3ddc97',
                          border:'2px solid '+(porDefinir?'#1a4060':yaGuardado?'#3ddc97':'#2a6a50'),
                          borderRadius:8,outline:'none'}}/>
                      <span style={{color:'#555',fontWeight:700}}>—</span>
                      <input type="number" min="0" max="99" value={pred.s2} disabled={porDefinir}
                        onChange={e=>onChange(p.id,'s2',e.target.value)}
                        style={{width:40,height:40,textAlign:'center',fontSize:18,fontWeight:700,
                          background:porDefinir?'#0d2137':'#0e3d2a',
                          color:porDefinir?'#333':'#3ddc97',
                          border:'2px solid '+(porDefinir?'#1a4060':yaGuardado?'#3ddc97':'#2a6a50'),
                          borderRadius:8,outline:'none'}}/>
                    </div>
                    <div style={{flex:1,textAlign:'center'}}>
                      {bv && <img src={bv} alt={p.visita} style={{width:32,height:22,objectFit:'cover',borderRadius:3,display:'block',margin:'0 auto 4px'}}/>}
                      <span style={{fontSize:12,fontWeight:600}}>{p.visita}</span>
                    </div>
                  </div>

                  {!porDefinir && (
                    <button onClick={()=>guardar(p)} disabled={car
