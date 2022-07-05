const express = require("express");
const router = express.Router();
const userService = require("./userService");
require("dotenv").config();
const jwt = require("jsonwebtoken");
router.get("/user/:id", async function (req, res) {
  res.json(await userService.getUsuario(req.params.id, req.headers));
});

router.put("/user/:id", async function (req, res) {
  // console.log("user put ", req,  req.params.id, req.body);
  res.json(
    await userService.putUsuario(req.params.id, req.body, req.headers.cnpj)
  );
});

router.get("/users", async function (req, res) {
  const lista = await userService.getUsuarios(req.headers);
  console.log("lista de " + lista.lista.length);
  res.json();
});

router.post("/user", async function (req, res) {
  res.json(await userService.postUsuario(req.body, req.headers));
});

router.post('/reset-password-admin', async function (req, res) {
  res.json(await userService.postResetPasswordAdmin(req.body.user, req.headers));
});

router.delete("/user/:id", async function (req, res) {
  res.json(await userService.deleteUsuario(req.params.id, req.headers));
});

router.put("/user-verify-by-admin/:id", async function (req, res) {
  res.json(await userService.putUserverify(req.params.id, req.headers));
});

router.put("/correcao-dados-basicos/:id", async function (req, res) {
  res.json(
    await userService.putCorrecaoDadosBasicos(req.params.id, req.body, req.headers)
  );
});

router.get('/people/:perfil', async function (req, res) {
  res.json(await userService.getPerson(req.params.perfil, req.headers));
});

module.exports = router;

// dashboard/login
