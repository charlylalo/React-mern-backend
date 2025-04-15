const express = require("express");
const { dbConnection } = require("./db/config");
require('dotenv').config();
const cors = require('cors')

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
app.get('/', (req, res) => {
  res.send('Hola Mundo')
})


// Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});

