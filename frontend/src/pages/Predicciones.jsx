import { useEffect, useState } from 'react';
import NavBottom from '../components/NavBottom';

// 🟢 MAPA COMPLETO (puedes editarlo luego)
const equiposMap = {
  A1: { nombre: 'México', codigo: 'mx' },
  A2: { nombre: 'Sudáfrica', codigo: 'za' },
  A3: { nombre: 'Corea del Sur', codigo: 'kr' },
  A4: { nombre: 'Chequia', codigo: 'cz' },

  B1: { nombre: 'Canadá', codigo: 'ca' },
  B2: { nombre: 'Bosnia', codigo: 'ba' },
  B3: { nombre: 'Catar', codigo: 'qa' },
  B4: { nombre: 'Suiza', codigo: 'ch' },

  C1: { nombre: 'Brasil', codigo: 'br' },
  C2: { nombre: 'Marruecos', codigo: 'ma' },
  C3: { nombre: 'Japón', codigo: 'jp' },
  C4: { nombre: 'Escocia', codigo: 'gb' },

  D1: { nombre: 'Estados Unidos', codigo: 'us' },
  D2: { nombre: 'Paraguay', codigo: 'py' },
  D3: { nombre: 'Australia', codigo: 'au' },
  D4: { nombre: 'Turquía', codigo: 'tr' }
};

// 🔹 HELPERS
const getNombre = (key) => equiposMap[key]?.nombre || key;

const getBandera = (key) =>
  equiposMap[key]?.codigo
    ? `https://flagcdn.com/w40/${equiposMap[key].codigo}.png`
    : null;

// 🟢 GENERAR GRUPOS (CON FECHAS REALES Y ORDENADOS)
const generarGrupos = () => {
  let id = 1;
  const partidos = [];

  const grupos = ['A', 'B', 'C', 'D'];
  const horarios = ['11:00', '14:00', '17:00', '20:00'];

  let fecha = new Date('2026-06-11T11:00:00');

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
      const f = new Date(fecha);
      f.setDate(fecha.getDate() + Math.floor(id / 4));

      const [h, m] = horarios[i % 4].split(':');
      f.setHours(h, m);

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

// 🔹 FORMATO
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
                <p>
                  <strong>
                    {getNombre(p.equipo_local)} vs {getNombre(p.equipo_visitante)}
                  </strong>
                </p>
              ) : (
                <div style={{ display: 'flex', gap: 5 }}>
                  <input placeholder="Local"
                    value={p.equipo_local}
                    onChange={e => editarEquipo(p.id,'equipo_local',e.target.value)} />
                  <span>vs</span>
                  <input placeholder="Visitante"
                    value={p.equipo_visitante}
                    onChange={e => editarEquipo(p.id,'equipo_visitante',e.target.value)} />
                </div>
              )}

              <small>{getHora(p.fecha_hora)}</small>

              {/* BANDERAS + RESULTADOS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>

                {/* LOCAL */}
                <div style={{ textAlign: 'center' }}>
                  {getBandera(p.equipo_local) ? (
                    <img src={getBandera(p.equipo_local)} style={{ width: 32 }} />
                  ) : (
                    <div style={{ width: 32, height: 22, background: '#eee' }} />
                  )}
                  <input type="number"
                    value={predicciones[p.id]?.s1 ?? ''}
                    onChange={e => onChange(p.id,'s1',e.target.value)} />
                </div>

                {/* VISITANTE */}
                <div style={{ textAlign: 'center' }}>
                  {getBandera(p.equipo_visitante) ? (
                    <img src={getBandera(p.equipo_visitante)} style={{ width: 32 }} />
                  ) : (
                    <div style={{ width: 32, height: 22, background: '#eee' }} />
                  )}
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
