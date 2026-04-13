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
    weekday: 'long', day: 'numeric', month: 'long'
  });
};

const getHora = (fecha) => {
  const d = new Date(fecha);
  return d.toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit'
  });
};

export default function Predicciones() {
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [guardados, setGuardados] = useState({});
  const [tab, setTab] = useState('grupos');

  const tabs = ['grupos','16avos','octavos','cuartos','semis','final'];

  // ✅ evitar duplicados desde origen
  useEffect(() => {
    api.getPartidos().then(data => {
      if (!Array.isArray(data)) return;

      const unicos = Array.from(
        new Map(data.map(p => [p.id, p])).values()
      );

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
    if (tab === 'semis') return p.fase === 'semifinal';
    return p.fase === tab;
  });

  // ✅ agrupar sin duplicar
  const porFecha = partidosFiltrados.reduce((acc, p) => {
    const key = getFechaKey(p.fecha_hora);

    if (!acc[key]) acc[key] = [];

    // evitar duplicado en grupo
    if (!acc[key].some(x => x.id === p.id)) {
      acc[key].push(p);
    }

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

      {/* HEADER */}
      <div style={{ background: '#1D9E75', padding: 12 }}>
        <h1 style={{ color: '#fff', fontSize: 16 }}>
          Mis predicciones
        </h1>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div>
        {Object.entries(porFecha).map(([fecha, lista]) => (
          <div key={fecha}>
            <h3>{fecha}</h3>

            {lista.map(p => (
              <div key={p.id} style={{ border: '1px solid #ddd', margin: 8, padding: 10 }}>
                
                <p>{p.equipo_local} vs {p.equipo_visitante}</p>
                <small>{getHora(p.fecha_hora)}</small>

                <div>
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
                  {guardados[p.id] ? 'Guardado' : 'Guardar'}
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
