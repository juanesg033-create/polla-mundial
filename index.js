require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crearTablas = require('./src/db/schema');
const crearAdmin = require('./crearAdmin');
const cargarPartidos = require('./partidos-mundial');
const authRoutes = require('./src/routes/auth');
const apiRoutes = require('./src/routes/api');
const iniciarScheduler = require('./src/scheduler');

const app = express();

app.use(cors({
  origin: ['https://polla-mundial-production.up.railway.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.get('/', (req, res) => res.json({ mensaje: 'API Polla Mundial - Sector las Brisas 🏆' }));

const iniciar = async () => {
  try {
    await crearTablas();
    await crearAdmin();
    await cargarPartidos(