const { response } = require("express");
const Evento = require("../models/Evento");

const getEventos = async (req, res = response) => {
  const eventos = await Evento.find().populate("user", "name");
  // populate sirve para obtener más datos de las tablas de referencia y el segundo argumento es el campo de interés
  res.status(200).json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res = response) => {
  // Verificar que tenga el evento
  const evento = new Evento(req.body);
  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();
    res.json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Contacte a su administrador",
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventId);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe con el id proporcionado",
      });
    }
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar este evento",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };
    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventId,
      nuevoEvento,
      { new: true } // Bandera para que regrese el documento actualizado, sino se indica entonces siempre envía el doc anterior para efectos de comparación.
    );

    return res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Contacte a su administrador",
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const evento = await Evento.findById(eventId);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe con el id proporcionado",
      });
    }
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio para eliminar este evento",
      });
    }

    const result = await Evento.findByIdAndDelete(eventId);
    return res.json({
      ok: true,
      msg: "Evento eliminado correctamente",
      result
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Contacte a su administrador",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
