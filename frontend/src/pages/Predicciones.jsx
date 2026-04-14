const generarGrupos = () => {
  const partidos = [];
  let id = 1;

  const grupos = {
    A: ['México','Sudáfrica','Corea del Sur','Chequia'],
    B: ['Canadá','Bosnia','Catar','Suiza'],
    C: ['Brasil','Marruecos','Japón','Escocia'],
    D: ['EEUU','Paraguay','Australia','Turquía'],
    E: ['Alemania','Ecuador','Nigeria','Polonia'],
    F: ['Francia','Chile','Dinamarca','Irán'],
    G: ['Argentina','Perú','Serbia','Corea Norte'],
    H: ['España','Colombia','Egipto','Suecia'],
    I: ['Inglaterra','Uruguay','Ghana','Canadá B'],
    J: ['Portugal','Bolivia','Croacia','Japón B'],
    K: ['Italia','Venezuela','Senegal','Australia B'],
    L: ['Países Bajos','Panamá','Costa Rica','Qatar B']
  };

  // 3 jornadas reales
  const jornadas = [
    [[0,1],[2,3]],
    [[0,2],[1,3]],
    [[0,3],[1,2]]
  ];

  const horas = ['11:00','14:00'];

  let fecha = new Date('2026-06-11T00:00:00');

  Object.entries(grupos).forEach(([grupo, equipos], gIndex) => {

    jornadas.forEach((jornada, jIndex) => {

      // 👉 cada grupo empieza en días distintos
      const fechaJornada = new Date(fecha);
      fechaJornada.setDate(fecha.getDate() + (gIndex * 3) + jIndex);

      jornada.forEach((match, i) => {

        const f = new Date(fechaJornada);
        const [h, m] = horas[i].split(':');
        f.setHours(h, m);

        partidos.push({
          id: id++,
          equipo_local: equipos[match[0]],
          equipo_visitante: equipos[match[1]],
          fecha_hora: f.toISOString(),
          fase: 'grupos',
          grupo
        });

      });

    });

  });

  return partidos;
};
