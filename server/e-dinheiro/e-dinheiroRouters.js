const express = require("express");
const router = express.Router();
const myService = require("./e-dinheiroService");
const decodeAuthCNPJ = require("../infra/decode-authorization");

router.post("/e-dinheiro/cadastros", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  if (!code.autorizado) {
    res.json({
      codeErro: 1,
      message: "Origem não permitida ou token inválido!",
    });
  }
  const list = await myService.getEdinheiroCadastros(req.body, req.headers);
  console.log("Tota de registros selecionados ", list.totalRegistros);
  res.json(list);
});

router.get("/e-dinheiro/cadastros", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  // console.log('code', code, 'headers', req.headers);
  if (!code.autorizado) {
    res.json({
      codeErro: 1,
      message: "Origem não permitida ou token inválido!",
    });
  }
  let page = req.query.page;
  const list = await myService.getEdinheiroCadastrosQuery(page, req.headers);
  // console.log("Tota de registros selecionados ", list.totalRegistros);
  res.json(list);
});

router.get("/e-dinheiro/cadastro/:id", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  // console.log('code', code, 'headers', req.headers);
  if (!code.autorizado) {
    res.json({
      codeErro: 1,
      message: "Origem não permitida ou token inválido!",
    });
  }
  const list = await myService.getEdinheiroCadastro(req.params.id, req.headers);
  res.json(list);
});


router.post("/e-dinheiro/agentes", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  if (!code.autorizado) {
    res.json({
      codeErro: 1,
      message: "Origem não permitida ou token inválido!",
    });
  }
  const list = await myService.getEdinheiroAgentes(req.headers);
  console.log("Tota de registros selecionados ", list.totalRegistros);
  res.json(list);
});

router.post("/e-dinheiro/supervisores", async function (req, res) {
  let code = decodeAuthCNPJ(req.headers);
  if (!code.autorizado) {
    res.json({
      codeErro: 1,
      message: "Origem não permitida ou token inválido!",
    });
  }
  const list = await myService.getEdinheiroSupervidores(req.headers);
  console.log("Tota de registros selecionados ", list.totalRegistros);
  res.json(list);
});

router.post("/cadastros-list", async function (req, res) {
  const list = await myService.postCadastros(req.body, req.headers);
  // console.log("Tota de registros selecionados ", list.totalRegistros);
  res.json(list);
});

module.exports = router;
