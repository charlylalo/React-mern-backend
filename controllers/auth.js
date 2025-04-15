const { response } = require("express"); // No es necesaria esta importación solo si se requiere el autocompletado para hacer las respuestas
const bcrypt = require("bcryptjs");
// const { validationResult } = require("express-validator");

const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");

// const crearUsuario = (req, res) => { // Función normal sin autocompletado
//   res.json({
//     ok: true,
//     msg: 'registro'
//   })
// }

const crearUsuario = async (req, res = response) => {
  // Se debe asignar express.response al param para el autocompletado
  const { email, password } = req.body;
  // if(name.length < 5 ){ // Validación anterior
  //   return res.status(400).json({
  //     ok: false,
  //     msg: "El nombre debe de ser de 5 letras"
  //   })
  // }

  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    usuario = new Usuario(req.body); // Validaciones con el midleware

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();
    const token = await generarJWT(usuario.id, usuario.name);

    // Se pasa a un custom middleware
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     ok: false,
    //     errors: errors.mapped(),
    //   });
    // }
    res.status(201).json({
      ok: true,
      uid: usuario?.id,
      name: usuario?.name,
      msg: "Usuario creado con éxito",
      token,
      // user: {
      //   name,
      //   email,
      //   password,
      // },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor, contacte al administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({
  //     ok: false,
  //     errors: errors.mapped(),
  //   });
  // }

  try {
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe, verifica tu usuario o contraseña",
      });
    }

    //Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario o la contraseña no son correctos",
      });
    }

    //TODO: Generar el JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      msg: "Sesión iniciada correctamente",
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor, contacte al administrador",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;
  const token = await generarJWT(uid, name);
  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
