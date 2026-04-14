import { useEffect, useState } from 'react';
import NavBottom from '../components/NavBottom';

const partidosMock = [
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

const banderas = {
  'México': 'mx','Sudáfrica': 'za','Corea del Sur': 'kr','Chequia': 'cz',
  'Canadá': 'ca','Bosnia y Herzegovina': 'ba','Estados Unidos': 'us','Paraguay': 'py',
  'Catar': 'qa','Suiza': 'ch','Brasil': 'br','Marruecos': 'ma'
};

const getBandera = (pais) => {
  const codigo = banderas[pais];
  return codigo ? `https://flagcdn.com/w40/${codigo}.png` : null;
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

  useEffect(() => {
    setPartidos(partidosMock);
  }, []);

  const onChange = (id, team, value) => {
    const v = parseInt(value) || 0;

    setPredicciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [team]: v }
    }));
  };

  const porFecha = partidos.reduce((acc, p) => {
    const key = getFecha(p.fecha_hora);
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div>

      {/* HEADER */}
      <div style={{ background: '#1D9E75', padding: 12 }}>
        <h2 style={{ color: '#fff' }}>Partidos definidos - Mundial 2026</h2>
      </div>

      {/* LISTA */}
      <div>
        {Object.entries(porFecha).map(([fecha, lista]) => (
          <div key={fecha}>
            <h3 style={{ padding: '8px 12px' }}>{fecha}</h3>

            {lista.map(p => (
              <div key={p.id} style={{ border: '1px solid #ddd', margin: 10, padding: 12 }}>
                
                <p><strong>{p.equipo_local} vs {p.equipo_visitante}</strong></p>
                <small>{getHora(p.fecha_hora)}</small>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                  
                  <div style={{ textAlign: 'center' }}>
                    <img src={getBandera(p.equipo_local)} alt="" style={{ width: 32 }} />
                    <input
                      type="number"
                      value={predicciones[p.id]?.s1 || 0}
                      onChange={e => onChange(p.id,'s1',e.target.value)}
                    />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <img src={getBandera(p.equipo_visitante)} alt="" style={{ width: 32 }} />
                    <input
                      type="number"
                      value={predicciones[p.id]?.s2 || 0}
                      onChange={e => onChange(p.id,'s2',e.target.value)}
                    />
                  </div>

                </div>

              </div>
            ))}
          </div>
        ))}
      </div>

      <NavBottom />
    </div>
  );
}
