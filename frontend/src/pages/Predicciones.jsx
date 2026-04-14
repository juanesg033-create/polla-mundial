import { useEffect, useState } from 'react';
import NavBottom from '../components/NavBottom';

// 🔥 TODOS LOS PARTIDOS (YA DEL EXCEL)
const partidosBase = [
  { equipo_local: 'México', equipo_visitante: 'Sudáfrica', fecha_hora: '2026-06-11T11:00:00', fase: 'grupos' },
  { equipo_local: 'Corea del Sur', equipo_visitante: 'Chequia', fecha_hora: '2026-06-11T14:00:00', fase: 'grupos' },
  { equipo_local: 'México', equipo_visitante: 'Corea del Sur', fecha_hora: '2026-06-11T17:00:00', fase: 'grupos' },
  { equipo_local: 'Sudáfrica', equipo_visitante: 'Chequia', fecha_hora: '2026-06-11T20:00:00', fase: 'grupos' },
  { equipo_local: 'México', equipo_visitante: 'Chequia', fecha_hora: '2026-06-12T11:00:00', fase: 'grupos' },
  { equipo_local: 'Sudáfrica', equipo_visitante: 'Corea del Sur', fecha_hora: '2026-06-12T14:00:00', fase: 'grupos' },

  { equipo_local: 'Canadá', equipo_visitante: 'Bosnia', fecha_hora: '2026-06-12T11:00:00', fase: 'grupos' },
  { equipo_local: 'Catar', equipo_visitante: 'Suiza', fecha_hora: '2026-06-12T14:00:00', fase: 'grupos' },
  { equipo_local: 'Canadá', equipo_visitante: 'Catar', fecha_hora: '2026-06-13T17:00:00', fase: 'grupos' },
  { equipo_local: 'Bosnia', equipo_visitante: 'Suiza', fecha_hora: '2026-06-13T20:00:00', fase: 'grupos' },
  { equipo_local: 'Canadá', equipo_visitante: 'Suiza', fecha_hora: '2026-06-13T11:00:00', fase: 'grupos' },
  { equipo_local: 'Bosnia', equipo_visitante: 'Catar', fecha_hora: '2026-06-13T14:00:00', fase: 'grupos' },

  { equipo_local: 'Brasil', equipo_visitante: 'Marruecos', fecha_hora: '2026-06-14T11:00:00', fase: 'grupos' },
  { equipo_local: 'Japón', equipo_visitante: 'Escocia', fecha_hora: '2026-06-14T14:00:00', fase: 'grupos' },
  { equipo_local: 'Brasil', equipo_visitante: 'Japón', fecha_hora: '2026-06-14T17:00:00', fase: 'grupos' },
  { equipo_local: 'Marruecos', equipo_visitante: 'Escocia', fecha_hora: '2026-06-14T20:00:00', fase: 'grupos' },
  { equipo_local: 'Brasil', equipo_visitante: 'Escocia', fecha_hora: '2026-06-15T11:00:00', fase: 'grupos' },
  { equipo_local: 'Marruecos', equipo_visitante: 'Japón', fecha_hora: '2026-06-15T14:00:00', fase: 'grupos' },

  { equipo_local: 'EEUU', equipo_visitante: 'Paraguay', fecha_hora: '2026-06-15T11:00:00', fase: 'grupos' },
  { equipo_local: 'Australia', equipo_visitante: 'Turquía', fecha_hora: '2026-06-15T14:00:00', fase: 'grupos' },
  { equipo_local: 'EEUU', equipo_visitante: 'Australia', fecha_hora: '2026-06-16T17:00:00', fase: 'grupos' },
  { equipo_local: 'Paraguay', equipo_visitante: 'Turquía', fecha_hora: '2026-06-16T20:00:00', fase: 'grupos' },
  { equipo_local: 'EEUU', equipo_visitante: 'Turquía', fecha_hora: '2026-06-16T11:00:00', fase: 'grupos' },
  { equipo_local: 'Paraguay', equipo_visitante: 'Australia', fecha_hora: '2026-06-16T14:00:00', fase: 'grupos' },

  { equipo_local: 'Alemania', equipo_visitante: 'Ecuador', fecha_hora: '2026-06-17T11:00:00', fase: 'grupos' },
  { equipo_local: 'Nigeria', equipo_visitante: 'Polonia', fecha_hora: '2026-06-17T14:00:00', fase: 'grupos' },
  { equipo_local: 'Alemania', equipo_visitante: 'Nigeria', fecha_hora: '2026-06-17T17:00:00', fase: 'grupos' },
  { equipo_local: 'Ecuador', equipo_visitante: 'Polonia', fecha_hora: '2026-06-17T20:00:00', fase: 'grupos' },
  { equipo_local: 'Alemania', equipo_visitante: 'Polonia', fecha_hora: '2026-06-18T11:00:00', fase: 'grupos' },
  { equipo_local: 'Ecuador', equipo_visitante: 'Nigeria', fecha_hora: '2026-06-18T14:00:00', fase: 'grupos' },

  { equipo_local: 'Francia', equipo_visitante: 'Chile', fecha_hora: '2026-06-18T11:00:00', fase: 'grupos' },
  { equipo_local: 'Dinamarca', equipo_visitante: 'Irán', fecha_hora: '2026-06-18T14:00:00', fase: 'grupos' },
  { equipo_local: 'Francia', equipo_visitante: 'Dinamarca', fecha_hora: '2026-06-19T17:00:00', fase: 'grupos' },
  { equipo_local: 'Chile', equipo_visitante: 'Irán', fecha_hora: '2026-06-19T20:00:00', fase: 'grupos' },
  { equipo_local: 'Francia', equipo_visitante: 'Irán', fecha_hora: '2026-06-19T11:00:00', fase: 'grupos' },
  { equipo_local: 'Chile', equipo_visitante: 'Dinamarca', fecha_hora: '2026-06-19T14:00:00', fase: 'grupos' },

  { equipo_local: 'Argentina', equipo_visitante: 'Perú', fecha_hora: '2026-06-20T11:00:00', fase: 'grupos' },
  { equipo_local: 'Serbia', equipo_visitante: 'Corea Norte', fecha_hora: '2026-06-20T14:00:00', fase: 'grupos' },
  { equipo_local: 'Argentina', equipo_visitante: 'Serbia', fecha_hora: '2026-06-20T17:00:00', fase: 'grupos' },
  { equipo_local: 'Perú', equipo_visitante: 'Corea Norte', fecha_hora: '2026-06-20T20:00:00', fase: 'grupos' },
  { equipo_local: 'Argentina', equipo_visitante: 'Corea Norte', fecha_hora: '2026-06-21T11:00:00', fase: 'grupos' },
  { equipo_local: 'Perú', equipo_visitante: 'Serbia', fecha_hora: '2026-06-21T14:00:00', fase: 'grupos' },

  { equipo_local: 'España', equipo_visitante: 'Colombia', fecha_hora: '2026-06-21T11:00:00', fase: 'grupos' },
  { equipo_local: 'Egipto', equipo_visitante: 'Suecia', fecha_hora: '2026-06-21T14:00:00', fase: 'grupos' },
  { equipo_local: 'España', equipo_visitante: 'Egipto', fecha_hora: '2026-06-22T17:00:00', fase: 'grupos' },
  { equipo_local: 'Colombia', equipo_visitante: 'Suecia', fecha_hora: '2026-06-22T20:00:00', fase: 'grupos' },
  { equipo_local: 'España', equipo_visitante: 'Suecia', fecha_hora: '2026-06-22T11:00:00', fase: 'grupos' },
  { equipo_local: 'Colombia', equipo_visitante: 'Egipto', fecha_hora: '2026-06-22T14:00:00', fase: 'grupos' }
];

// 🔥 IDS AUTOMÁTICOS
const partidosReales = partidosBase.map((p, i) => ({
  id: i + 1,
  ...p
}));

// 🔴 GENERAR FASES (igual que ya tenías)
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

// 🏳️ BANDERAS (igual que tu código)
const banderas = { 'México': 'mx','Brasil': 'br','Colombia': 'co' };

const getBandera = (pais) =>
  banderas[pais] ? `https://flagcdn.com/w40/${banderas[pais]}.png` : null;

export default function Predicciones() {
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});
  const [tab, setTab] = useState('grupos');

  useEffect(() => {
    setPartidos([...partidosReales, ...generarFases()]);
  }, []);

  const filtrados = partidos.filter(p => p.fase === tab);

  const ordenados = [...filtrados].sort(
    (a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)
  );

  const porFecha = ordenados.reduce((acc, p) => {
    const key = p.fecha_hora.split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(porFecha).map(([fecha, lista]) => (
        <div key={fecha}>
          <h3>{fecha}</h3>
          {lista.map(p => (
            <div key={p.id}>
              {p.equipo_local} vs {p.equipo_visitante}
            </div>
          ))}
        </div>
      ))}
      <NavBottom />
    </div>
  );
}
