const BASE = "https://laudable-wonder-production-cca2.up.railway.app";
const h = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` });

export const api = {
  login: (usuario, password) => fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ usuario, password }) }).then(r => r.json()),
  actualizarNombre: (nombre_display) => fetch(`${BASE}/auth/nombre`, { method: 'PUT', headers: h(), body: JSON.stringify({ nombre_display }) }).then(r => r.json()),
  getPartidos: () => fetch(`${BASE}/partidos`, { headers: h() }).then(r => r.json()),
  crearPartido: (data) => fetch(`${BASE}/partidos`, { method: 'POST', headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  ingresarResultado: (id, gl, gv) => fetch(`${BASE}/partidos/${id}/resultado`, { method: 'PUT', headers: h(), body: JSON.stringify({ goles_local: gl, goles_visitante: gv }) }).then(r => r.json()),
  misPredicciones: () => fetch(`${BASE}/predicciones/mis`, { headers: h() }).then(r => r.json()),
  guardarPrediccion: (partido_id, gl, gv) => fetch(`${BASE}/predicciones`, { method: 'POST', headers: h(), body: JSON.stringify({ partido_id, goles_local: gl, goles_visitante: gv }) }).then(r => r.json()),
  clasificacion: () => fetch(`${BASE}/clasificacion`, { headers: h() }).then(r => r.json()),
  getPozo: () => fetch(`${BASE}/pozo`, { headers: h() }).then(r => r.json()),
  actualizarPozo: (monto_total) => fetch(`${BASE}/pozo`, { method: 'PUT', headers: h(), body: JSON.stringify({ monto_total }) }).then(r => r.json()),
  misEspeciales: () => fetch(`${BASE}/especiales/mis`, { headers: h() }).then(r => r.json()),
  guardarEspeciales: (campeon, goleador) => fetch(`${BASE}/especiales`, { method: 'POST', headers: h(), body: JSON.stringify({ campeon, goleador }) }).then(r => r.json()),
  getUsuarios: () => fetch(`${BASE}/usuarios`, { headers: h() }).then(r => r.json()),
  crearUsuario: (data) => fetch(`${BASE}/usuarios`, { method: 'POST', headers: h(), body: JSON.stringify(data) }).then(r => r.json()),
  toggleUsuario: (id) => fetch(`${BASE}/usuarios/${id}/toggle`, { method: 'PUT', headers: h() }).then(r => r.json()),
  eliminarUsuario: (id) => fetch(`${BASE}/usuarios/${id}`, { method: 'DELETE', headers: h() }).then(r => r.json()),
};
