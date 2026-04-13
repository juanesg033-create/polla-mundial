import { useEffect, useState } from 'react';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

const banderas = {
  'México': 'mx','Ecuador': 'ec','Estados Unidos': 'us','Cuba': 'cu',
  'Argentina': 'ar','Islandia': 'is','Marruecos': 'ma','Irak': 'iq',
  'España': 'es','Croacia': 'hr','Brasil': 'br','Alemania': 'de',
  'Francia': 'fr','Colombia': 'co','Portugal': 'pt','Argelia': 'dz'
};

const getBandera = (pais) => {
  const codigo = banderas[pais];
  return codigo ? `https://flagcdn.com/w40/${codigo}.png` : null;
};

const getFechaKey = (fecha) => {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
};

const getHora = (fecha) => {
  const d = new Date(fecha);
  return d.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Predicciones() {
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [guardados, setGuardados] = useState({});
  const [tab, setTab] = useState('grupos');

  const tabs = ['grupos','16avos','octavos','cuartos','semis','final'];

  useEffect(() => {
    api.getPartidos().then(data => {
      if (!Array.isArray(data)) return;

      // eliminar duplicados
      let unicos = Array.from(
        new Map(
          data.map(p => [
            `${p.equipo_local}-${p.equipo_visitante}-${p.fecha_hora}`,
            p
          ])
        ).values()
      );

      // 🔥 detectar si NO hay 16avos
      const hay16avos = unicos.some(p => p.fase === '16avos');

      if (!hay16avos) {
        const hoy = new Date();

        const mock16avos = [
          { id: 9001, equipo_local: '1A', equipo_visitante: '3C' },
          { id: 9002, equipo_local: '2B', equipo_visitante: '2F' },
          { id: 9003, equipo_local: '1C', equipo_visitante: '3E' },
          { id: 9004, equipo_local: '2A', equipo_visitante: '2D' },
          { id: 9005, equipo_local: '1B', equipo_visitante: '3F' },
          { id: 9006, equipo_local: '2C', equipo_visitante: '2E' },
          { id: 9007, equipo_local: '1D', equipo_visitante: '3B' },
          { id: 9008, equipo_local: '2A', equipo_visitante: '3D' }
        ].map(p => ({
          ...p,
          fecha_hora: hoy.toISOString(),
          cierre_prediccion: hoy.toISOString(),
          fase: '16avos',
          finalizado: false
        }));

        unicos = [...unicos, ...mock16avos];
      }

      setPartidos(unicos);
    });

    api.misPredicciones().then(d => {
      if (!Array.isArray(d)) return;

      const mapa = {};
      const gmap = {};

      d.forEach(p => {
        mapa[p.partido_id] = {
          s1: p.goles_local,
          s2: p.goles_visitante
        };
        gmap[p.partido_id] = true;
      });

      setPredicciones(mapa);
      setGuardados(gmap);
    });
  }, []);

  const onChange = (id, team, value) => {
    const v = parseInt(value) || 0;

    setPredicciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [team]: v }
    }));

    setGuardados(prev => ({
      ...prev,
      [id]: false
    }));
  };

  const partidosFiltrados = partidos.filter(p => {
    if (tab === 'semis') return p.fase === 'semifinal' || p.fase === 'semis';
    return p.fase === tab;
  });

  const porFecha = partidosFiltrados.reduce((acc, p) => {
    const key = getFechaKey(p.fecha_hora);

    if (!acc[key]) acc[key] = [];
    if (!acc[key].some(x => x.id === p.id)) acc[key].push(p);

    return acc;
  }, {});

  const guardar = async (p) => {
    const pred = predicciones[p.id] || { s1: 0, s2: 0 };
    await api.guardarPrediccion(p.id, pred.s1, pred.s2);

    setGuardados(prev => ({
      ...prev,
      [p.id]: true
    }));
  };

  return (
    <div>

      <div style={{ background: '#1D9E75', padding: '12px 16px' }}>
        <h1 style={{ color: '#E1F5EE', fontSize: 15, margin: 0 }}>
          Mis predicciones
        </h1>
      </div>

      <div style={{ display: 'flex', background: '#0F6E56' }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 12px',
              color: tab === t ? '#fff' : '#9FE1CB',
              background: 'none',
              border: 'none',
              borderBottom: tab === t ? '2px solid #fff' : 'none'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        {Object.entries(porFecha).map(([fecha, lista]) => (
          <div key={fecha}>
            <h3>{fecha}</h3>

            {lista.map(p => (
              <div key={p.id} style={{ border: '1px solid #ddd', margin: 10, padding: 12 }}>
                
                <p><strong>{p.equipo_local} vs {p.equipo_visitante}</strong></p>
                <small>{getHora(p.fecha_hora)}</small>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <input
                    type="number"
                    value={predicciones[p.id]?.s1 || 0}
                    onChange={e => onChange(p.id,'s1',e.target.value)}
                  />
                  <input
                    type="number"
                    value={predicciones[p.id]?.s2 || 0}
                    onChange={e => onChange(p.id,'s2',e.target.value)}
                  />
                </div>

                <button onClick={() => guardar(p)}>
                  {guardados[p.id] ? 'Guardado ✓' : 'Guardar'}
                </button>

              </div>
            ))}
          </div>
        ))}
      </div>

      <NavBottom />
    </div>
  );
}
