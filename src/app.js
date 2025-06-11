// src/app.js  (versión CommonJS)

// 0) Variables de entorno (.env)
require('dotenv').config();          // coloca esto siempre al principio

const express = require('express');
const path = require('path');
const helmet = require('helmet');    // ← require en lugar de import
const cors = require('cors');

const app = express();

/* ——— Middlewares globales ——— */
app.use(helmet());                   // cabeceras seguras
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      // Habilita atributos onclick, onload, etc.
      "script-src-attr": ["'self'", "'unsafe-inline'"],
      // (opcional) Si tienes <script> inline:
      // "script-src": ["'self'", "'unsafe-inline'"],
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ——— Archivos estáticos ——— */
app.use(express.static(path.join(__dirname, '../public')));

/* ——— Rutas ——— */
const userRoutes = require('./routes/userRoutes');
const petRoutes  = require('./routes/petRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/users', userRoutes);
app.use('/api/pets',  petRoutes);
app.use('/api/auth',  authRoutes);
app.use('/api/chats', chatRoutes);

/* ——— Raíz ——— */
app.get('/', (_req, res) => res.redirect('/login.html'));

/* ——— Exporta para index.js o tests ——— */
module.exports = app;
