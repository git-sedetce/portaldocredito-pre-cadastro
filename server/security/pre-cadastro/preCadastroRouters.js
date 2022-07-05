const express = require("express");
const router = express.Router();
const usuarioService = require("./preCadastroService");
router.post("/pre-cadastro", async function (req, res) {
  res.json(await usuarioService.postUsuario(req.body, req.headers));
});

module.exports = router;
