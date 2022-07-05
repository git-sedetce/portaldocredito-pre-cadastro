const md5 = require("md5");
const decodeAuthCNPJ = function (headers) {
  // console.log("decodeAuthCNPJ", headers);
  let cnpj = "03319184000145";
  let clientToken = "";
  let auth = "";
  let retorno = { autorizado: false, message: "" };
  let tokensDecode = [
    "https://cearacredi.ce.gov.br",
    "http://hom-portal-do-credito-pre-cadastro.s3-website-sa-east-1.amazonaws.com",
    "https://cadastro.cearacredi.ce.gov.br",
    "https://prod-portal-do-credito-pre-cadastro.s3-sa-east-1.amazonaws.com",
    "http://localhost:4202",
    "BI-SEDET",
    "e-dinheiroe-dinheiro",
  ];

  let docs = ["21590044000199", "44086423391"];

  let token = [];
  tokensDecode.forEach((item) => {
    token.push(md5(item));
  });

  if (headers.origin && token.indexOf(headers.origin) === -1) {
    retorno.autorizado = true;
  }

  if (!retorno.autorizado && headers.authorization) {
    heads = headers.authorization.split(" "); //[1]; // auth.split(":");

    auth = heads[1].split(":")[1]; //Buffer.from(heads[1].split(":")[1], "base64").toString();
    let doc = heads[1].split(":")[0];
    // console.log("doc", doc, "heads", heads[1].split(":"));
    if (docs.indexOf(doc) === -1) {
      retorno.message = "Origem, DocNo e Token não autorizado";
      return retorno;
    }

    clientToken = auth; // heads[1];
    if (token.indexOf(clientToken) !== -1) {
      retorno.autorizado = true;
    }
    if (!retorno.autorizado) {
      retorno.message = "Origem e Token não autorizado";
      return retorno;
    }
  }
  if (!retorno.autorizado) {
    retorno.message = "Origem e Token não autorizado";
    return retorno;
  }

  return retorno;
};

module.exports = decodeAuthCNPJ;
