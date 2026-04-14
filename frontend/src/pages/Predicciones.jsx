import { useEffect, useState } from 'react';
import NavBottom from '../components/NavBottom';

// 🔵 SOLO PARTIDOS REALES (los que ya viste)
const partidosReales = [
  {
    id: 1,
    equipo_local: 'México',
    equipo_visitante: 'Sudáfrica',
    fecha_hora: '2026-06-11T14:00:00',
    fase: 'grupos',
    grupo: 'A'
  },
  {
    id: 2,
    equipo_local: 'Corea del Sur',
    equipo_visitante: 'Chequia',
    fecha_hora: '2026-06-11T21:00:00',
    fase: 'grupos',
    grupo: 'A'
  },
  {
    id: 3,
    equipo_local: 'Canadá',
    equipo_visitante: 'Bosnia y Herzegovina',
    fecha_hora: '2026-06-12T14:00:00',
    fase: 'grupos',
    grupo: 'B'
  },
  {
    id: 4,
    equipo_local: 'Estados Unidos',
    equipo_visitante: 'Paraguay',
    fecha_hora: '2026-06-12T20:00:00',
    fase: 'grupos',
    grupo: 'D'
  },
  {
    id: 5,
    equipo_local: 'Catar',
    equipo_visitante: 'Suiza',
    fecha_hora: '2026-06-13T14:00:00',
    fase: 'grupos',
    grupo: 'B'
  },
  {
    id: 6,
    equipo_local: 'Brasil',
    equipo_visitante: 'Marruecos',
    fecha_hora: '2026-06-13T17:00:00',
    fase: 'grupos',
    grupo: 'C'
  }
];

// 🔴 GENERADOR DE TODO LO DEMÁS (SIN INVENTAR EQUIPOS)
const generarFases = () => {
  let id = 1000;
  const hoy = new Date().toISOString();

  const crear = (fase, cantidad) =>
    Array.from({ length: cantidad }, () => ({
      id: id++,
      equipo_local: 'Por definir',
      equipo_visitante: 'Por definir',
      fecha_hora: hoy,
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

// 🏳️ BANDERAS (solo si existe país real)
const banderas = {
  'México': 'mx','Sudáfrica': 'za','Corea del Sur': 'kr','Chequia': 'cz',
  'Canadá': 'ca','Bosnia y Herzegovina': 'ba','Estados Unidos': 'us','Paraguay': 'py',
  'Catar': 'qa','Suiza': 'ch','Brasil': 'br','Marruecos': 'ma'
};

const getBandera = (pais) =>
  banderas[pais] ? `https://flagcdn.com/w40/${banderas[pais]}.png` : null;

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
    const fases = generarFases();
    setPartidos([...partidosReales, ...fases]);
  }, []);

  const onChange = (id, team, value) => {
    const v = parseInt(value) || 0;

    setPredicciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [team]: v }
    }));
  };

  const filtrados = partidos.filter(p => p.fase === tab);

  const porFecha = filtrados.reduce((acc, p) => {
    const key = getFecha(p.fecha_hora);
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div>

      {/* HEADER */}
      <div style={{ background: '#1D9E75', padding: 12 }}>
        <h2 style={{ color: '#fff' }}>Mundial 2026</h2>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', background: '#0F6E56' }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: 10,
              color: tab === t ? '#fff' : '#9FE1CB',
              background: 'none',
              border: 'none'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* LISTA */}
      {Object.entries(porFecha).map(([fecha, lista]) => (
        <div key={fecha}>
          <h3 style={{ padding: 10 }}>{fecha}</h3>

          {lista.map(p => {
            const bl = getBandera(p.equipo_local);
            const bv = getBandera(p.equipo_visitante);

            return (
              <div key={p.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
                
                <p><strong>{p.equipo_local} vs {p.equipo_visitante}</strong></p>
                <small>{getHora(p.fecha_hora)}</small>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                  
                  <div style={{ textAlign: 'center' }}>
                    {bl ? (
                      <img src={bl} style={{ width: 32 }} />
                    ) : (
                      <div style={{ width: 32, height: 22, background: '#eee' }} />
                    )}
                    <input
                      type="number"
                      value={predicciones[p.id]?.s1 || 0}
                      onChange={e => onChange(p.id,'s1',e.target.value)}
                    />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    {bv ? (
                      <img src={bv} style={{ width: 32 }} />
                    ) : (
                      <div style={{ width: 32, height: 22, background: '#eee' }} />
                    )}
                    <input
                      type="number"
                      value={predicciones[p.id]?.s2 || 0}
                      onChange={e => onChange(p.id,'s2',e.target.value)}
                    />
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ))}

      <NavBottom />
    </div>
  );
}
