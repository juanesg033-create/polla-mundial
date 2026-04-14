import { useEffect, useState } from 'react';
import NavBottom from '../components/NavBottom';

// 🔥 PEGA TODOS LOS PARTIDOS AQUÍ (SIN ID)
const partidosBase = [
  { equipo_local: 'México', equipo_visitante: 'Sudáfrica', fecha_hora: '2026-06-11T14:00:00', fase: 'grupos' },
  { equipo_local: 'Corea del Sur', equipo_visitante: 'Chequia', fecha_hora: '2026-06-11T21:00:00', fase: 'grupos' },
  { equipo_local: 'Canadá', equipo_visitante: 'Bosnia y Herzegovina', fecha_hora: '2026-06-12T14:00:00', fase: 'grupos' },
  { equipo_local: 'Estados Unidos', equipo_visitante: 'Paraguay', fecha_hora: '2026-06-12T20:00:00', fase: 'grupos' },
  { equipo_local: 'Catar', equipo_visitante: 'Suiza', fecha_hora: '2026-06-13T14:00:00', fase: 'grupos' },
  { equipo_local: 'Brasil', equipo_visitante: 'Marruecos', fecha_hora: '2026-06-13T17:00:00', fase: 'grupos' }

  // 👇 PEGA TODO TU EXCEL AQUÍ (sin id, solo copia filas)
];

// 🔴 GENERAR IDS AUTOMÁTICOS (🔥 ESTO SOLUCIONA TU ERROR)
const partidosReales = partidosBase.map((p, i) => ({
  id: i + 1,
  ...p
}));

// 🔴 GENERAR FASES
const generarFases = () => {
  let id = 10000;
  const hoy = new Date().toISOString();

  const crear = (fase, cantidad) =>
    Array.from({ length: cantidad }, () => ({
      id: id++,
      equipo_local: 'Por definir',
      equipo_visitante: 'Por definir',
      fecha_hora: hoy,
      fase
    }));

  return [
    ...crear('16avos', 16),
    ...crear('octavos', 8),
    ...crear('cuartos', 4),
    ...crear('semis', 2),
    ...crear('final', 1)
  ];
};

// 🏳️ BANDERAS
const banderas = {
  'México': 'mx','Sudáfrica': 'za','Corea del Sur': 'kr','Chequia': 'cz',
  'Canadá': 'ca','Bosnia y Herzegovina': 'ba','Estados Unidos': 'us','Paraguay': 'py',
  'Catar': 'qa','Suiza': 'ch','Brasil': 'br','Marruecos': 'ma'
};

const getBandera = (pais) =>
  banderas[pais] ? `https://flagcdn.com/w40/${banderas[pais]}.png` : null;

// 📅 FORMATO
const formatFechaTitulo = (fechaISO) =>
  new Date(fechaISO).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

const formatHora = (fechaISO) =>
  new Date(fechaISO).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });

export default function Predicciones() {
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [tab, setTab] = useState('grupos');

  const tabs = ['grupos','16avos','octavos','cuartos','semis','final'];

  useEffect(() => {
    setPartidos([...partidosReales, ...generarFases()]);
  }, []);

  const onChange = (id, team, value) => {
    const v = parseInt(value) || 0;
    setPredicciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [team]: v }
    }));
  };

  const filtrados = partidos.filter(p => p.fase === tab);

  const ordenados = [...filtrados].sort(
    (a, b) => new Date(a.fecha_hora || 0) - new Date(b.fecha_hora || 0)
  );

  const porFecha = ordenados.reduce((acc, p) => {
    const key = p.fecha_hora.split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div style={{ background: '#0b1d3a', minHeight: '100vh', color: '#fff' }}>

      <div style={{ background: '#1D9E75', padding: 12 }}>
        <h2>Mundial 2026</h2>
      </div>

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

      {Object.entries(porFecha).map(([fecha, lista]) => (
        <div key={fecha}>

          <h3 style={{ padding: 10 }}>
            {formatFechaTitulo(fecha)}
          </h3>

          {lista.map(p => {
            const bl = getBandera(p.equipo_local);
            const bv = getBandera(p.equipo_visitante);

            return (
              <div key={p.id} style={{
                background: '#132c54',
                margin: 10,
                padding: 12,
                borderRadius: 12
              }}>

                <small>{formatHora(p.fecha_hora)}</small>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10
                }}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {bl
                      ? <img src={bl} style={{ width: 32 }} />
                      : <div style={{ width: 32, height: 22, background: '#ccc' }} />
                    }
                    <span>{p.equipo_local}</span>
                  </div>

                  <div>
                    <input
                      type="number"
                      value={predicciones[p.id]?.s1 || 0}
                      onChange={e => onChange(p.id,'s1',e.target.value)}
                      style={{ width: 40, textAlign: 'center' }}
                    />
                    <span style={{ margin: '0 5px' }}>-</span>
                    <input
                      type="number"
                      value={predicciones[p.id]?.s2 || 0}
                      onChange={e => onChange(p.id,'s2',e.target.value)}
                      style={{ width: 40, textAlign: 'center' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{p.equipo_visitante}</span>
                    {bv
                      ? <img src={bv} style={{ width: 32 }} />
                      : <div style={{ width: 32, height: 22, background: '#ccc' }} />
                    }
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
