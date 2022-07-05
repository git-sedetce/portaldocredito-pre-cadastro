const express = require("express");
const router = express.Router();
const myService = require("./dashboardService");
const decodeAuthCNPJ = require("../infra/decode-authorization");

router.get("/dashboard-login", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  res.json(await myService.getDashboardLogin(req.headers));
});

router.get("/dashboard-hoje/:id", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  res.json(await myService.getDashboardHoje(req.params.id, req.headers));
});

router.get("/carga-bi", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  if (!code.autorizado)
    res.json({
      message: "Acesso não autorizado. Entre em contato com o administrador",
    });
  res.json(await myService.getCargaBI(req.headers));
});

router.get("/carga-bi-reduzida", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  if (!code.autorizado)
    res.json({
      message: "Acesso não autorizado. Entre em contato com o administrador",
    });
  res.json(await myService.getCargaBIReduzida(req.headers));
});

router.get("/media-horaria", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  if (!code.autorizado)
    res.json({
      message: "Acesso não autorizado. Entre em contato com o administrador",
    });
  res.json(await myService.getMediaHoraria(req.headers));
});

router.get("/porregional-detalhes", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  if (!code.autorizado)
    res.json({
      message: "Acesso não autorizado. Entre em contato com o administrador",
    });
  res.json(await myService.getPorRegionalDetalhes(req.headers));
});

router.get("/porregional", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);

  const list = await myService.getPorRegional(req.headers);
  res.json(list);
});

router.get('/bigchart', async (req, res) => {
  let code = decodeAuthCNPJ(req.headers);
  res.json(await myService.getBigChart(req.headers));
})

module.exports = router;
