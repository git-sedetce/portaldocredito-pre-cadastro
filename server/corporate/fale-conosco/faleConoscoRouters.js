const express = require("express");
const router = express.Router();
const myService = require("./faleConoscoService");

router.post("/fale-conosco", async function (req, res) {
  const retorno = await myService.postFaleConosco(req.body, req.headers);
  res.json(retorno);
});

router.get("/fale-conosco-list", async function (req, res) {
  const retorno = await myService.getFaleConoscoList( req.headers);
  res.json(retorno);
});



module.exports = router;
