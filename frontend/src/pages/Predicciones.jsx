import { useState } from 'react';
import NavBottom from '../components/NavBottom';

// 🟢 BANDERAS
const banderas = {
  'México':'mx','Sudáfrica':'za','Corea del Sur':'kr','Chequia':'cz',
  'Canadá':'ca','Bosnia':'ba','Catar':'qa','Suiza':'ch',
  'Brasil':'br','Marruecos':'ma','Japón':'jp','Escocia':'gb',
  'EEUU':'us','Paraguay':'py','Australia':'au','Turquía':'tr',
  'Alemania':'de','Ecuador':'ec','Nigeria':'ng','Polonia':'pl',
  'Francia':'fr','Chile':'cl','Dinamarca':'dk','Irán':'ir',
  'Argentina':'ar','Perú':'pe','Serbia':'rs','Corea Norte':'kp',
  'España':'es','Colombia':'co','Egipto':'eg','Suecia':'se',
  'Inglaterra':'gb','Uruguay':'uy','Ghana':'gh','Canadá B':'ca',
  'Portugal':'pt','Bolivia':'bo','Croacia':'hr','Japón B':'jp',
  'Italia':'it','Venezuela':'ve','Senegal':'sn','Australia B':'au',
  'Países Bajos':'nl','Panamá':'pa','Costa Rica':'cr','Qatar B':'qa'
};

const getBandera = (pais) =>
  banderas[pais]
    ? `https://flagcdn.com/w40/${banderas[pais]}.png`
    : null;

// 🟢 FUNCIÓN PARA CREAR GRUPO (MISMA ESTRUCTURA DEL EXCEL)
const crearGrupo = (grupo, equipos, startId, startDate) => {
  const partidos = [];
  let id = startId;

  const jornadas = [
    [[0,1],[2,3]],
    [[0,2],[1,3]],
    [[0,3],[1,2]]
  ];

  let fecha = new Date(startDate);

  jornadas.forEach(jornada => {
    jornada.forEach((p, i) => {
      const f = new Date(fecha);
      f.setHours(i === 0 ? 11 : 14);

      partidos.push({
        id: id++,
        fase: 'grupos',
        grupo,
        equipo_local: equipos[p[0]],
        equipo_visitante: equipos[p[1]],
        fecha_hora: f.toISOString()
      });
    });
    fecha.setDate(fecha.getDate() + 1);
  });

  return partidos;
};

// 🟢 TODOS LOS GRUPOS (DEL EXCEL)
const partidosIniciales = [
  ...crearGrupo('A',['México','Sudáfrica','Corea del Sur','Chequia'],1,'2026-06-11'),
  ...crearGrupo('B',['Canadá','Bosnia','Catar','Suiza'],7,'2026-06-14'),
  ...crearGrupo('C',['Brasil','Marruecos','Japón','Escocia'],13,'2026-06-17'),
  ...crearGrupo('D',['EEUU','Paraguay','Australia','Turquía'],19,'2026-06-20'),
  ...crearGrupo('E',['Alemania','Ecuador','Nigeria','Polonia'],25,'2026-06-23'),
  ...crearGrupo('F',['Francia','Chile','Dinamarca','Irán'],31,'2026-06-26'),
  ...crearGrupo('G',['Argentina','Perú','Serbia','Corea Norte'],37,'2026-06-29'),
  ...crearGrupo('H',['España','Colombia','Egipto','Suecia'],43,'2026-07-02'),
  ...crearGrupo('I',['Inglaterra','Uruguay','Ghana','Canadá B'],49,'2026-07-05'),
  ...crearGrupo('J',['Portugal','Bolivia','Croacia','Japón B'],55,'2026-07-08'),
  ...crearGrupo('K',['Italia','Venezuela','Senegal','Australia B'],61,'2026-07-11'),
  ...crearGrupo('L',['Países Bajos','Panamá','Costa Rica','Qatar B'],67,'2026-07-14'),

  // ELIMINATORIAS
  { id:100,fase:'16avos',equipo_local:'',equipo_visitante:'',fecha_hora:'2026-06-28T16:00:00' },
  { id:200,fase:'final',equipo_local:'',equipo_visitante:'',fecha_hora:'2026-07-19T17:00:00' }
];

// 🔹 FORMATO
const getFecha = f =>
  new Date(f).toLocaleDateString('es-CO',{ weekday:'long',day:'numeric',month:'long' });

const getHora = f =>
  new Date(f).toLocaleTimeString('es-CO',{ hour:'2-digit',minute:'2-digit' });

export default function Predicciones() {

  const [data,setData] = useState(partidosIniciales);
  const [tab,setTab] = useState('grupos');

  const tabs = ['grupos','16avos','octavos','cuartos','semis','final'];

  const editarEquipo = (id,campo,valor) => {
    setData(prev => prev.map(p => p.id===id ? {...p,[campo]:valor} : p));
  };

  const filtrados = data
    .filter(p => p.fase===tab)
    .sort((a,b)=> new Date(a.fecha_hora)-new Date(b.fecha_hora));

  const porFecha = filtrados.reduce((acc,p)=>{
    const fecha = getFecha(p.fecha_hora);
    if(!acc[fecha]) acc[fecha]=[];
    acc[fecha].push(p);
    return acc;
  },{});

  return (
    <div>

      <div style={{ background:'#1D9E75',padding:12 }}>
        <h2 style={{ color:'#fff' }}>Mundial 2026</h2>
      </div>

      <div style={{ display:'flex',background:'#0F6E56' }}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{ flex:1,padding:10,color:tab===t?'#fff':'#9FE1CB',background:'none',border:'none' }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {Object.entries(porFecha).map(([fecha,lista])=>(
        <div key={fecha}>
          <h3 style={{ padding:10 }}>{fecha}</h3>

          {lista.map(p=>(
            <div key={p.id} style={{ border:'1px solid #ccc',margin:10,padding:10 }}>

              {tab==='grupos' ? (
                <p><strong>{p.equipo_local} vs {p.equipo_visitante}</strong></p>
              ) : (
                <div style={{ display:'flex',gap:5 }}>
                  <input value={p.equipo_local}
                    onChange={e=>editarEquipo(p.id,'equipo_local',e.target.value)} />
                  <span>vs</span>
                  <input value={p.equipo_visitante}
                    onChange={e=>editarEquipo(p.id,'equipo_visitante',e.target.value)} />
                </div>
              )}

              <small>{getHora(p.fecha_hora)}</small>

              <div style={{ display:'flex',gap:10,marginTop:10 }}>
                {getBandera(p.equipo_local) && <img src={getBandera(p.equipo_local)} width={32}/>}
                {getBandera(p.equipo_visitante) && <img src={getBandera(p.equipo_visitante)} width={32}/>}
              </div>

            </div>
          ))}
        </div>
      ))}

      <NavBottom/>
    </div>
  );
}
