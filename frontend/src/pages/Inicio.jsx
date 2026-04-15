import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import NavBottom from '../components/NavBottom';

const BANDERAS = {
  'México':'mx','Sudáfrica':'za','Corea del Sur':'kr','Rep. Checa':'cz',
  'Canadá':'ca','Bosnia y Herzegovina':'ba','Qatar':'qa','Suiza':'ch',
  'Brasil':'br','Marruecos':'ma','Haití':'ht','Escocia':'gb-sct',
  'Estados Unidos':'us','Paraguay':'py','Australia':'au','Turquía':'tr',
  'Alemania':'de','Curazao':'cw','Costa de Marfil':'ci','Ecuador':'ec',
  'Países Bajos':'nl','Japón':'jp','Suecia':'se','Túnez':'tn',
  'Bélgica':'be','Egipto':'eg','Irán':'ir','Nueva Zelanda':'nz',
  'España':'es','Cabo Verde':'cv','Arabia Saudita':'sa','Uruguay':'uy',
  'Francia':'fr','Senegal':'sn','Irak':'iq','Noruega':'no',
  'Austria':'at','Jordania':'jo','Argentina':'ar','Argelia':'dz',
  'Portugal':'pt','RD Congo':'cd','Uzbekistán':'uz','Colombia':'co',
  'Inglaterra':'gb-eng','Croacia':'hr','Ghana':'gh','Panamá':'pa',
};

const fmt = n => '$' + Math.round(n).toLocaleString('es-CO');
const flag = nombre => BANDERAS[nombre] ? `https://flagcdn.com/w40/${BANDERAS[nombre]}.png` : null;

export default function Inicio() {
  const { usuario } = useAuth();
  const [partidos, setPartidos] = useState([]);
  const [pozo, setPozo] = useState(null);
  const [clasificacion, setClasificacion] = useState([]);

  useEffect(() => {
    api.getPartidos().then(d => setPartidos(Array.isArray(d) ? d : []));
    api.getPozo().then(d => setPozo(d));
    api.clasificacion().then(d => setClasificacion(Array.isArray(d) ? d : []));
  }, []);

  const ahora = new Date();
  const proximos = partidos.filter(p => !p.finalizado && new Date(p.fecha_hora) > ahora).slice(0, 3);
  const miPosicion = clasificacion.find(c => c.nombre_display === usuario?.nombre_display);

  const formatFecha = (f) => {
    const d = new Date(f);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div style={{ background: '#1D9E75', padding: '12px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '14px' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#E1F5EE', flexShrink: 0 }}>
            {usuario?.nombre_display?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <p style={{ color: '#E1F5EE', fontSize: 15, fontWeight: 600, margin: 0 }}>{usuario?.nombre_display}</p>
            <p style={{ color: '#9FE1CB', fontSize: 12, margin: 0 }}>Sector las Brisas · Mundial 2026</p>
          </div>
        </div>
        {pozo && (
          <div className="premios-row">
            <div className="premio-card premio-1">
              <p className="puesto">1er puesto</p>
              <p className="monto">{fmt(pozo.premio_1)}</p>
              <p className="pct">70% del pozo</p>
            </div>
            <div className="premio-card premio-2">
              <p className="puesto">2do puesto</p>
              <p className="monto">{fmt(pozo.premio_2)}</p>
              <p className="pct">20% del pozo</p>
            </div>
            <div className="premio-card premio-3">
              <p className="puesto">3er puesto</p>
              <p className="monto">{fmt(pozo.premio_3)}</p>
              <p className="pct">10% del pozo</p>
            </div>
          </div>
        )}
      </div>

      <div className="contenido">
        {miPosicion && (
          <div className="card" style={{ background: '#1D9E75', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#27500A' }}>{miPosicion.posicion}</div>
              <div>
                <p style={{ color: '#E1F5EE', fontSize: 13, fontWeight: 600, margin: 0 }}>Tu posición actual</p>
                <p style={{ color: '#9FE1CB', fontSize: 11, margin: 0 }}>de {clasificacion.length} participantes</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#E1F5EE', fontSize: 22, fontWeight: 700, margin: 0 }}>{miPosicion.puntos_total}</p>
              <p style={{ color: '#9FE1CB', fontSize: 10, margin: 0 }}>puntos</p>
            </div>
          </div>
        )}

        <p style={{ fontSize: 11, fontWeight: 600, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Próximos partidos</p>

        {proximos.length === 0 && <p style={{ fontSize: 13, color: '#999', textAlign: 'center', padding: '1rem' }}>No hay partidos próximos cargados aún</p>}

        {proximos.map(p => (
          <div key={p.id} className="partido-card">
            <div className="partido-header">
              <span className="partido-info">{p.grupo} · {formatFecha(p.fecha_hora)}</span>
              <span className="badge badge-green">Próximo</span>
            </div>
            <div className="equipos-row">
              <div className="equipo">
                {flag(p.equipo_local) && <img src={flag(p.equipo_local)} alt={p.equipo_local} style={{width:28,height:19,objectFit:'cover',borderRadius:2,display:'block',margin:'0 auto 3px'}}/>}
                <span className="equipo-nombre">{p.equipo_local}</span>
              </div>
              <span className="vs">vs</span>
              <div className="equipo">
                {flag(p.equipo_visitante) && <img src={flag(p.equipo_visitante)} alt={p.equipo_visitante} style={{width:28,height:19,objectFit:'cover',borderRadius:2,display:'block',margin:'0 auto 3px'}}/>}
                <span className="equipo-nombre">{p.equipo_visitante}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <NavBottom />
    </div>
  );
}
