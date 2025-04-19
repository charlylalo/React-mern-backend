const express = require("express");
const { dbConnection } = require("./db/config");
require('dotenv').config();
const cors = require('cors')
const path = require('path')

//Crear el servidor express
const app = express();

// Base de datos
dbConnection();

// CORS
app.use(cors()) // configuración de cors

//Directorio público
app.use(express.static('public'))

// Lectura y parseo del body
app.use(express.json())


//Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/events', require('./routes/events'))
//TODO: CRUD

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})


// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

module.exports = app;