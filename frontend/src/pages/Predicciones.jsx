const generarGrupos = () => {
  let id = 1;
  const partidos = [];

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

  const horarios = ['11:00', '14:00'];

  let fechaBase = new Date('2026-06-11T11:00:00');
  let diaOffset = 0;

  Object.entries(grupos).forEach(([grupo, equipos]) => {

    const jornadas = [
      [[equipos[0], equipos[1]], [equipos[2], equipos[3]]],
      [[equipos[0], equipos[2]], [equipos[1], equipos[3]]],
      [[equipos[0], equipos[3]], [equipos[1], equipos[2]]]
    ];

    jornadas.forEach((jornada) => {

      jornada.forEach((partido, i) => {
        const f = new Date(fechaBase);
        f.setDate(fechaBase.getDate() + diaOffset);

        const [h, m] = horarios[i].split(':');
        f.setHours(h, m);

        partidos.push({
          id: id++,
          equipo_local: partido[0],
          equipo_visitante: partido[1],
          fecha_hora: f.toISOString(),
          fase: 'grupos',
          grupo
        });
      });

      diaOffset++; // siguiente día para la siguiente jornada
    });

  });

  return partidos;
};
