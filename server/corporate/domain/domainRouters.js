const express = require("express");
const router = express.Router();
const myService = require("./domainService");

router.get("/domains/:nome", async function (req, res) {
  const list = await myService.getDomains(req.params.nome, req.headers);
  res.json(list);
});

router.get("/kindofdomain", async function (req, res) {
  const list = await myService.getKindOfDomain(req.headers);
  res.json(list);
});

router.post("/consultacep", async function (req, res) {
  const retorno = await myService.postConsultaCEP(req.body, req.headers);
  res.json(retorno);
});
router.get("/ceps", async function (req, res) {
  const retorno = await myService.getCeps(req.headers);
  res.json(retorno);
});

router.post("/domain", async function (req, res) {
  res.json(await myService.postDomain(req.body, req.headers));
});

router.put("/domain/:id", async function (req, res) {
  res.json(await myService.putDomain(req.params.id, req.body, req.headers));
});

router.delete("/domain/:id", async function (req, res) {
  res.json(await myService.deleteDomain(req.params.id,  req.headers));
});
module.exports = router;
