import { useEffect, useState } from 'react';
import NavBottom from '../components/NavBottom';

// 🟢 MAPA DE BANDERAS (según tu Excel)
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

// 🟢 GENERAR PARTIDOS DESDE EL EXCEL (MISMA LÓGICA)
const generarGrupos = () => {
  let id = 1;
  const partidos = [];

  const grupos = {
    A: ['México','Sudáfrica','Corea del Sur','Chequia'],
    B: ['Canadá','Bosnia','Catar','Suiza'],
    C: ['Brasil','Marruecos','Japón','Escocia'],
    D: ['EEUU','Paraguay','Australia','Turquía'],
    E: ['Alemania','Ecuador','Nigeria','Polonia'],
    F: ['Francia','Chile','Dinamarca','Irán'],
    G: ['Argentina','Perú','Serbia','Corea Norte'],
    H: ['España','Colombia','Egipto','Suecia'],
    I: ['Inglaterra','Uruguay','Ghana','Canadá B'],
    J: ['Portugal','Bolivia','Croacia','Japón B'],
    K: ['Italia','Venezuela','Senegal','Australia B'],
    L: ['Países Bajos','Panamá','Costa Rica','Qatar B']
  };

  const horarios = [11,14,17,20];
  let fecha = new Date('2026-06-11T11:00:00');

  Object.entries(grupos).forEach(([grupo, equipos]) => {

    const cruces = [
      [equipos[0], equipos[1]],
      [equipos[2], equipos[3]],
      [equipos[0], equipos[2]],
      [equipos[1], equipos[3]],
      [equipos[0], equipos[3]],
      [equipos[1], equipos[2]]
    ];

    cruces.forEach((c, i) => {
      const f = new Date(fecha);
      f.setDate(fecha.getDate() + Math.floor(id / 4));
      f.setHours(horarios[i % 4], 0);

      partidos.push({
        id: id++,
        equipo_local: c[0],
        equipo_visitante: c[1],
        fecha_hora: f.toISOString(),
        fase: 'grupos',
        grupo
      });
    });
  });

  return partidos;
};

// 🔴 ELIMINATORIAS EDITABLES
const generarFases = () => {
  let id = 1000;

  const fechas = {
    '16avos': '2026-06-28T16:00:00',
    'octavos': '2026-07-04T16:00:00',
    'cuartos': '2026-07-09T16:00:00',
    'semis': '2026-07-14T18:00:00',
    'final': '2026-07-19T17:00:00'
  };

  const crear = (fase, cantidad) =>
    Array.from({ length: cantidad }, () => ({
      id: id++,
      equipo_local: '',
      equipo_visitante: '',
      fecha_hora: fechas[fase],
      fase,
      grupo: ''
    }));

  return [
    ...crear('16avos', 16),
    ...crear('octavos', 8),
    ...crear('cuartos', 4),
    ...crear('semis', 2),
    ...crear('final', 1)
  ];
};

// 🔹 FORMATOS
const getFecha = (f) =>
  new Date(f).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

const getHora = (f) =>
  new Date(f).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });

export default function Predicciones() {
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [tab, setTab] = useState('grupos');

  const tabs = ['grupos','16avos','octavos','cuartos','semis','final'];

  useEffect(() => {
    setPartidos([...generarGrupos(), ...generarFases()]);
  }, []);

  const editarEquipo = (id, campo, valor) => {
    setPartidos(prev =>
      prev.map(p => p.id === id ? { ...p, [campo]: valor } : p)
    );
  };

  const onChange = (id, team, value) => {
    const v = parseInt(value);
    setPredicciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [team]: isNaN(v) ? '' : v }
    }));
  };

  const filtrados = partidos
    .filter(p => p.fase === tab)
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

  const porFecha = filtrados.reduce((acc, p) => {
    const key = getFecha(p.fecha_hora);
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div>

      <div style={{ background: '#1D9E75', padding: 12 }}>
        <h2 style={{ color: '#fff' }}>Mundial 2026</h2>
      </div>

      <div style={{ display: 'flex', background: '#0F6E56' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: 10,
              color: tab === t ? '#fff' : '#9FE1CB',
              background: 'none',
              border: 'none'
            }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {Object.entries(porFecha).map(([fecha, lista]) => (
        <div key={fecha}>
          <h3 style={{ padding: 10 }}>{fecha}</h3>

          {lista.map(p => (
            <div key={p.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>

              {tab === 'grupos' ? (
                <p><strong>{p.equipo_local} vs {p.equipo_visitante}</strong></p>
              ) : (
                <div style={{ display: 'flex', gap: 5 }}>
                  <input value={p.equipo_local}
                    onChange={e => editarEquipo(p.id,'equipo_local',e.target.value)} />
                  <span>vs</span>
                  <input value={p.equipo_visitante}
                    onChange={e => editarEquipo(p.id,'equipo_visitante',e.target.value)} />
                </div>
              )}

              <small>{getHora(p.fecha_hora)}</small>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>

                <div>
                  {getBandera(p.equipo_local) && <img src={getBandera(p.equipo_local)} width={32} />}
                  <input type="number"
                    value={predicciones[p.id]?.s1 ?? ''}
                    onChange={e => onChange(p.id,'s1',e.target.value)} />
                </div>

                <div>
                  {getBandera(p.equipo_visitante) && <img src={getBandera(p.equipo_visitante)} width={32} />}
                  <input type="number"
                    value={predicciones[p.id]?.s2 ?? ''}
                    onChange={e => onChange(p.id,'s2',e.target.value)} />
                </div>

              </div>

            </div>
          ))}
        </div>
      ))}

      <NavBottom />
    </div>
  );
}
