import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import NavBottom from '../components/NavBottom';

// 🏳️ BANDERAS (puedes ampliarlo luego)
const banderas = {
  'México': 'mx','Sudáfrica': 'za','Corea del Sur': 'kr','Chequia': 'cz',
  'Canadá': 'ca','Bosnia y Herzegovina': 'ba','Estados Unidos': 'us','Paraguay': 'py',
  'Catar': 'qa','Suiza': 'ch','Brasil': 'br','Marruecos': 'ma'
};

const getBandera = (pais) =>
  banderas[pais] ? `https://flagcdn.com/w40/${banderas[pais]}.png` : null;

const formatFechaTitulo = (fechaISO) => {
  return new Date(fechaISO).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
};

const formatHora = (fechaISO) => {
  return new Date(fechaISO).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Predicciones() {
  const [partidos, setPartidos] = useState([]);
  const [predicciones, setPredicciones] = useState({});

  useEffect(() => {
    cargarExcel();
  }, []);

  // 🔥 LEER EXCEL COMPLETO
  const cargarExcel = async () => {
    const res = await fetch('/mundial_2026_con_equipos.xlsx'); // 👈 pon tu archivo en /public
    const data = await res.arrayBuffer();

    const workbook = XLSX.read(data, { type: 'array' });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(hoja);

    // ⚠️ AJUSTA ESTOS NOMBRES SEGÚN TU EXCEL
    const partidosFormateados = json.map((p, i) => ({
      id: i + 1,
      equipo_local: p.Local,
      equipo_visitante: p.Visitante,
      fecha_hora: convertirFecha(p.Fecha, p.Hora),
      fase: 'grupos'
    }));

    setPartidos(partidosFormateados);
  };

  // 🔥 CONVERTIR FECHA + HORA DEL EXCEL
  const convertirFecha = (fecha, hora) => {
    if (!fecha) return new Date().toISOString();

    const f = new Date(fecha);
    if (hora) {
      const [h, m] = hora.split(':');
      f.setHours(h);
      f.setMinutes(m);
    }

    return f.toISOString();
  };

  const onChange = (id, team, value) => {
    const v = parseInt(value) || 0;
    setPredicciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [team]: v }
    }));
  };

  // 🔥 ORDENAR + AGRUPAR POR FECHA REAL
  const ordenados = [...partidos].sort(
    (a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)
  );

  const porFecha = ordenados.reduce((acc, p) => {
    const key = p.fecha_hora.split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div style={{ background: '#0b1d3a', minHeight: '100vh', color: '#fff' }}>

      {/* HEADER */}
      <div style={{ background: '#1D9E75', padding: 12 }}>
        <h2>Mundial 2026</h2>
      </div>

      {/* LISTA POR FECHAS */}
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

                  {/* LOCAL */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {bl && <img src={bl} style={{ width: 32 }} />}
                    <span>{p.equipo_local}</span>
                  </div>

                  {/* MARCADOR */}
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

                  {/* VISITANTE */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{p.equipo_visitante}</span>
                    {bv && <img src={bv} style={{ width: 32 }} />}
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
