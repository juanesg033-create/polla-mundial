import { useEffect, useState } from 'react';
import NavBottom from '../components/NavBottom';

const partidosMock = [
  {
    id: 1,
    equipo_local: 'México',
    equipo_visitante: 'Estados Unidos',
    fecha_hora: '2026-06-11T19:00:00',
    cierre_prediccion: '2026-06-11T18:30:00',
    fase: 'grupos',
    grupo: 'A',
    finalizado: false
  },
  {
    id: 2,
    equipo_local: 'Colombia',
    equipo_visitante: 'Japón',
    fecha_hora: '2026-06-12T16:00:00',
    cierre_prediccion: '2026-06-12T15:30:00',
    fase: 'grupos',
    grupo: 'B',
    finalizado: false
  },
  {
    id: 3,
    equipo_local: 'Brasil',
    equipo_visitante: 'Alemania',
    fecha_hora: '2026-06-13T20:00:00',
    cierre_prediccion: '2026-06-13T19:30:00',
    fase: 'grupos',
    grupo: 'C',
    finalizado: false
  },
  {
    id: 4,
    equipo_local: 'Argentina',
    equipo_visitante: 'España',
    fecha_hora: '2026-06-14T18:00:00',
    cierre_prediccion: '2026-06-14T17:30:00',
    fase: 'grupos',
    grupo: 'D',
    finalizado: false
  },
  {
    id: 5,
    equipo_local: 'Francia',
    equipo_visitante: 'Italia',
    fecha_hora: '2026-06-15T21:00:00',
    cierre_prediccion: '2026-06-15T20:30:00',
    fase: 'grupos',
    grupo: 'E',
    finalizado: false
  }
];

const banderas = {
  'México': 'mx','Estados Unidos': 'us','Colombia': 'co','Japón': 'jp',
  'Brasil': 'br','Alemania': 'de','Argentina': 'ar','España': 'es',
  'Francia': 'fr','Italia': 'it'
};

const getBandera = (pais) =>
  banderas[pais] ? `https://flagcdn.com/w40/${banderas[pais]}.png` : null;

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

  return (
    <div>

      <div style={{ background: '#1D9E75', padding: 12 }}>
        <h2 style={{ color: '#fff' }}>Prueba Mundial 2026</h2>
      </div>

      {partidos.map(p => (
        <div key={p.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
          
          <p><strong>{p.equipo_local} vs {p.equipo_visitante}</strong></p>
          <small>{new Date(p.fecha_hora).toLocaleString()}</small>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            
            <div style={{ textAlign: 'center' }}>
              <img src={getBandera(p.equipo_local)} alt="" />
              <input type="number" onChange={e => onChange(p.id,'s1',e.target.value)} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <img src={getBandera(p.equipo_visitante)} alt="" />
              <input type="number" onChange={e => onChange(p.id,'s2',e.target.value)} />
            </div>

          </div>

        </div>
      ))}

      <NavBottom />
    </div>
  );
}
