/**
 * Rutas de Usuarios / Auth
 * host + /api/auth
 */

const { Router } = require("express");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const router = Router();

const { validarJWT } = require("../middlewares/validar-jwt");

router.post(
  "/new",
  [
    // Dentro del arreglo existe una colección de midlewares que se van a inyectar al endpoint
    check("name", "El nombre es obligatorio").notEmpty(),
    check("email", "El email no es valido").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);
router.post(
  "/",
  [
    check("email", "El email no es valido").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;
