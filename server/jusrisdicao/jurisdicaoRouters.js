const express = require("express");
const router = express.Router();
const myService = require("./jurisdicaoService");

router.post("/jurisdicao", async function (req, res) {
  const list = await myService.postJurisdicao(req.body, req.headers);
  res.json(list);
});

router.put("/jurisdicao/:id", async function (req, res) {
  const list = await myService.putJurisdicao(
    req.params.id,
    req.body,
    req.headers
  );
  res.json(list);
});

router.post("/jurisdicao-local", async function (req, res) {
  const list = await myService.postJurisdicaoLocal(req.body, req.headers);
  res.json(list);
});

router.delete("/jurisdicao-local/:id", async function (req, res) {
  const list = await myService.deleteJurisdicaoLocal(
    req.params.id,
    req.headers
  );
  res.json(list);
});

router.delete("/jurisdicao-bairro/:id", async function (req, res) {
  const list = await myService.deleteJurisdicaoBairro(
    req.params.id,
    req.headers
  );
  res.json(list);
});

router.post("/jurisdicao-bairro", async function (req, res) {
  const list = await myService.postJurisdicaoBairro(req.body, req.headers);
  res.json(list);
});

router.get("/municipios-disponiveis", async function (req, res) {
  res.json(await myService.getMunicipiosDisponiveis(req.headers));
});

router.get("/bairros-disponiveis", async function (req, res) {
  res.json(await myService.getBairrosDisponiveis(req.headers));
});

router.get("/bairros-vinculados/:id", async function (req, res) {
  res.json(await myService.getBairrosVinculados(req.params.id, req.headers));
});

router.post("/minha-jurisdicao", async function (req, res) {
  res.json(await myService.getMinhaJurisdicao(req.body, req.headers));
});

router.get("/municipios-vinculados/:id", async function (req, res) {
  res.json(await myService.getMunicipiosVinculados(req.params.id, req.headers));
});

router.get("/jurisdicao/:id", async function (req, res) {
  const list = await myService.getJuristicao(req.params.id, req.headers);
  res.json(list);
});

router.get("/jurisdicoes", async function (req, res) {
  const list = await myService.getJuristicoes(req.headers);
  res.json(list);
});

router.post("/jurisdicao-agente", async function (req, res) {
  const list = await myService.postJurisdicaoAgente(req.body, req.headers);
  res.json(list);
});

router.delete("/jurisdicao-agente/:id", async function (req, res) {
  const list = await myService.deleteJurisdicaoAgente(
    req.params.id,
    req.headers
  );
  res.json(list);
});

router.get("/agentes-disponiveis", async function (req, res) {
  const list = await myService.getAgentesDisponiveis(req.headers);
  res.json(list);
});

router.get("/agentes-vinculados/:id", async function (req, res) {
  res.json(await myService.getAgentesVinculados(req.params.id, req.headers));
});

router.get("/agentes-jurisdicao/:id", async function (req, res) {
  res.json(await myService.getAgentesJurisdicao(req.params.id, req.headers));
});
router.post("/agente-jurisdicao", async function (req, res) {
  res.json(await myService.postAgentesJurisdicao(req.body, req.headers));
});

router.put("/atribuir-para-mim/:id", async function (req, res) {
  res.json(
    await myService.getAtribuirParaMim(req.params.id, req.body, req.headers)
  );
});

module.exports = router;
