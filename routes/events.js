const { Router } = require("express");

const router = Router();
const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/events");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");
const { isDate } = require("../helpers/isDate");

//Todas tienen que pasa por la validación del jwt
// Obtener eventos
// router.get("/", validarJWT, getEventos);

// //Crear un nuevo evento
// router.post("/", validarJWT, crearEvento);

// //Actualizar evento
// router.put("/:id", validarJWT, actualizarEvento);

// //Borrar evento
// router.delete("/:id", validarJWT, eliminarEvento);

// Con esta línea aplica el middleware a todas las peticiones que estén por debajo de el.
router.use(validarJWT);

//Si se requiere algún endpoint como público, ponerlo por encima de la línea anterior

router.get("/", getEventos);

//Crear un nuevo evento
router.post(
  "/",
  [
    check("title", "El título es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalización es obligatoria").custom(isDate),
    validarCampos,
  ],
  crearEvento
);

//Actualizar evento
router.put(
  "/:id",
  [
    check("title", "El título es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha de finalización es obligatoria").custom(isDate),
    validarCampos,
  ],
  actualizarEvento
);

//Borrar evento
router.delete("/:id", eliminarEvento);

module.exports = router;
