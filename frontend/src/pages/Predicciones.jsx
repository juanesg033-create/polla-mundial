import { useEffect, useState } from 'react';
import NavBottom from '../components/NavBottom';

// 🟢 FASE DE GRUPOS (estructura real FIFA)
const generarGrupos = () => {
  let id = 1;
  const partidos = [];

  const grupos = 'ABCDEFGHIJKL'.split('');
  const horarios = ['11:00:00', '14:00:00', '17:00:00', '20:00:00'];

  let fechaBase = new Date('2026-06-11T11:00:00');

  grupos.forEach((grupo) => {
    const equipos = [`${grupo}1`, `${grupo}2`, `${grupo}3`, `${grupo}4`];

    const cruces = [
      [equipos[0], equipos[1]],
      [equipos[2], equipos[3]],
      [equipos[0], equipos[2]],
      [equipos[1], equipos[3]],
      [equipos[0], equipos[3]],
      [equipos[1], equipos[2]]
    ];

    cruces.forEach((c, i) => {
      const fecha = new Date(fechaBase);
      fecha.setDate(fechaBase.getDate() + Math.floor(id / 4));

      const hora = horarios[i % 4].split(':');
      fecha.setHours(hora[0], hora[1]);

      partidos.push({
        id: id++,
        equipo_local: c[0],
        equipo_visitante: c[1],
        fecha_hora: fecha.toISOString(),
        fase: 'grupos',
        grupo
      });
    });
  });

  return partidos;
};

// 🔴 ELIMINATORIAS (fechas reales)
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
    Array.from({ length: cantidad }, (_, i) => ({
      id: id++,
      equipo_local: 'Por definir',
      equipo_visitante: 'Por definir',
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
    const grupos = generarGrupos();
    const fases = generarFases();
    setPartidos([...grupos, ...fases]);
  }, []);

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
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* LISTA */}
      {Object.entries(porFecha).map(([fecha, lista]) => (
        <div key={fecha}>
          <h3 style={{ padding: 10 }}>{fecha}</h3>

          {lista.map(p => (
            <div key={p.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
              
              <p><strong>{p.equipo_local} vs {p.equipo_visitante}</strong></p>
              <small>{getHora(p.fecha_hora)}</small>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                
                <input
                  type="number"
                  value={predicciones[p.id]?.s1 ?? ''}
                  onChange={e => onChange(p.id,'s1',e.target.value)}
                />

                <input
                  type="number"
                  value={predicciones[p.id]?.s2 ?? ''}
                  onChange={e => onChange(p.id,'s2',e.target.value)}
                />

              </div>

            </div>
          ))}
        </div>
      ))}

      <NavBottom />
    </div>
  );
}
