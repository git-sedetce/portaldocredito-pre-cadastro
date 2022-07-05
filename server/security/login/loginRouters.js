const express = require("express");
const router = express.Router();
const loginService = require("./loginService");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET =
  "401b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b372742           9090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1";

router.post("/code-verify", async function (req, res) {
  const validacao = await loginService.codeVerify(req.body, req.headers);
  res.json(validacao);
});

router.post("/loginbytoken", async function (req, res) {
  const validacao = await loginService.postLoginByToken(req.body, req.headers);
  res.json(validacao);
});

router.post("/login", async function (req, res) {
  const validacao = await loginService.postLogin(req.body, req.headers);
  res.json(validacao);
});

router.get('/jwt-check/:id', async function (req, res){
  res.json(await loginService.getJwtCheck(req.params.id, req.headers));
});

router.post('/tochange-password', async function (req, res) {
  res.json(await loginService.postToChangePassword(req.body, req.headers));
});

router.post('/tochange-perfil', async function (req, res) {
  res.json(await loginService.postToChangePerfil(req.body, req.headers));
});

router.post('/request-code-new-password', async function (req, res) {
  res.json(await loginService.postRequestCodeNewPassword(req.body, req.headers));
});

module.exports = router;
