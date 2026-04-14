import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import NavBottom from '../components/NavBottom';

// 🏳️ BANDERAS
const banderas = {
  'México': 'mx','Sudáfrica': 'za','Corea del Sur': 'kr','Chequia': 'cz',
  'Canadá': 'ca','Bosnia y Herzegovina': 'ba','Estados Unidos': 'us','Paraguay': 'py',
  'Catar': 'qa','Suiza': 'ch','Brasil': 'br','Marruecos': 'ma'
};

const getBandera = (pais) =>
  banderas[pais] ? `https://flagcdn.com/w40/${banderas[pais]}.png` : null;

// 🔥 CONVERTIR FECHA EXCEL (CLAVE)
const excelDateToJS = (excelDate) => {
  if (!excelDate) return new Date();

  // Si es número (formato Excel)
  if (typeof excelDate === 'number') {
    return new Date((excelDate - 25569) * 86400 * 1000);
  }

  // Si ya es string
  return new Date(excelDate);
};

// 🔥 FORMATEAR FECHA
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

  useEffect(() => {
    cargarExcel();
  }, []);

  // ✅ CARGA SEGURA DEL EXCEL
  const cargarExcel = async () => {
    try {
      const res = await fetch('/mundial_2026_con_equipos.xlsx');
      const data = await res.arrayBuffer();

      const workbook = XLSX.read(data, { type: 'array' });
      const hoja = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(hoja);

      const partidosFormateados = json.map((p, i) => {
        const fechaBase = excelDateToJS(p.Fecha);

        // ⏰ agregar hora si existe
        if (p.Hora) {
          let horas = 0, minutos = 0;

          if (typeof p.Hora === 'string') {
            const partes = p.Hora.split(':');
            horas = parseInt(partes[0]) || 0;
            minutos = parseInt(partes[1]) || 0;
          }

          fechaBase.setHours(horas);
          fechaBase.setMinutes(minutos);
        }

        return {
          id: i + 1,
          equipo_local: p.Local || 'Por definir',
          equipo_visitante: p.Visitante || 'Por definir',
          fecha_hora: fechaBase.toISOString(),
          fase: 'grupos'
        };
      });

      setPartidos(partidosFormateados);

    } catch (error) {
      console.error('Error cargando Excel:', error);
    }
  };

  const onChange = (id, team, value) => {
    const v = parseInt(value) || 0;
    setPredicciones(prev => ({
      ...prev,
      [id]: { ...prev[id], [team]: v }
    }));
  };

  // 🔥 ORDENAR
  const ordenados = [...partidos].sort(
    (a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)
  );

  // 🔥 AGRUPAR POR FECHA REAL
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

      {/* LISTA */}
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10
                }}>

                  {/* LOCAL */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {bl
                      ? <img src={bl} style={{ width: 32 }} />
                      : <div style={{ width: 32, height: 22, background: '#ccc' }} />
                    }
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
