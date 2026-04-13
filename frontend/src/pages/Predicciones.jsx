import { useEffect, useState } from 'react';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

const banderas = {
  'México': 'mx','Ecuador': 'ec','Estados Unidos': 'us','Cuba': 'cu',
  'Argentina': 'ar','Islandia': 'is','Marruecos': 'ma','Irak': 'iq',
  'España': 'es','Croacia': 'hr','Brasil': 'br','Alemania': 'de',
  'Francia': 'fr','Colombia': 'co','Portugal': 'pt','Argelia': 'dz',
  'Inglaterra': 'gb-eng','Senegal': 'sn','Países Bajos': 'nl',
  'Arabia Saudita': 'sa','Uruguay': 'uy','Sudáfrica': 'za',
  'Japón': 'jp','Australia': 'au','Italia': 'it','Chile': 'cl',
  'Bélgica': 'be','Perú': 'pe','Canadá': 'ca','Suiza': 'ch',
  'Corea del Sur': 'kr','Irán': 'ir','Ghana': 'gh','Camerún': 'cm',
  'Escocia': 'gb-sct','Uzbekistán': 'uz','Qatar': 'qa',
  'Rep. Checa': 'cz','Haití': 'ht','Bosnia y Herzegovina': 'ba',
  'Turquía': 'tr','Curazao': 'cw','Costa de Marfil': 'ci',
  'Túnez': 'tn','Suecia': 'se','Nueva Zelanda': 'nz',
  'Cabo Verde': 'cv','Noruega': 'no','Austria': 'at',
  'Jordania': 'jo','RD Congo': 'cd','Panamá': 'pa',
  'Paraguay': 'py','Egipto': 'eg'
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

  // 🔥 SIEMPRE visibles
  const tabs = ['grupos','16avos','octavos','cuartos','semis','final'];

  useEffect(() => {
    api.getPartidos().then(data => {
      if (!Array.isArray(data)) return;

      // eliminar duplicados
      const unicos = Array.from(
        new Map(
          data.map(p => [
            `${p.equipo_local}-${p.equipo_visitante}-${p.fecha_hora}`,
            p
          ])
        ).values()
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
    if (tab === 'semis') return p.fase === 'semifinal' || p.fase === 'semis';
    return p.fase === tab;
  });

  const porFecha = partidosFiltrados.reduce((acc, p) => {
    const key = getFechaKey(p.fecha_hora);

    if (!acc[key]) acc[key] = [];

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

  const total = partidos.length;
  const preditos = Object.values(guardados).filter(Boolean).length;
  const pct = total > 0 ? Math.round((preditos / total) * 100) : 0;

  return (
    <div>

      {/* HEADER */}
      <div style={{ background: '#1D9E75', padding: '12px 16px' }}>
        <h1 style={{ color: '#E1F5EE', fontSize: 15, margin: 0 }}>
          Mis predicciones
        </h1>
        <p style={{ color: '#9FE1CB', fontSize: 12, margin: 0 }}>
          Sector las Brisas · Mundial 2026
        </p>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', background: '#0F6E56', overflowX: 'auto' }}>
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

      {/* PROGRESO */}
      <div style={{ padding: 10 }}>
        <small>{preditos} de {total} guardadas ({pct}%)</small>
      </div>

      {/* LISTA */}
      <div>

        {partidosFiltrados.length === 0 && (
          <p style={{ textAlign: 'center', color: '#999', padding: 20 }}>
            Esta fase aún no tiene partidos disponibles
          </p>
        )}

        {Object.entries(porFecha).map(([fecha, lista]) => (
          <div key={fecha}>
            <h3 style={{ padding: '8px 12px' }}>{fecha}</h3>

            {lista.map(p => {
              const banderaLocal = getBandera(p.equipo_local);
              const banderaVisitante = getBandera(p.equipo_visitante);

              return (
                <div key={p.id} style={{ border: '1px solid #ddd', margin: 10, padding: 12 }}>
                  
                  <p><strong>{p.equipo_local} vs {p.equipo_visitante}</strong></p>
                  <small>{getHora(p.fecha_hora)}</small>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                    <div>
                      {banderaLocal && <img src={banderaLocal} alt="" />}
                      <input
                        type="number"
                        value={predicciones[p.id]?.s1 || 0}
                        onChange={e => onChange(p.id,'s1',e.target.value)}
                      />
                    </div>

                    <div>
                      {banderaVisitante && <img src={banderaVisitante} alt="" />}
                      <input
                        type="number"
                        value={predicciones[p.id]?.s2 || 0}
                        onChange={e => onChange(p.id,'s2',e.target.value)}
                      />
                    </div>
                  </div>

                  <button onClick={() => guardar(p)}>
                    {guardados[p.id] ? 'Guardado ✓' : 'Guardar'}
                  </button>

                </div>
              );
            })}
          </div>
        ))}

      </div>

      <NavBottom />
    </div>
  );
}
