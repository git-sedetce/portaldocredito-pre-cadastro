const myData = require("./e-dinheiroData");

exports.getEdinheiroCadastros = function (param, headers) {
  return myData.getEdinheiroCadastros(param, headers);
};

exports.postCadastros = function (params, headers) {
  return myData.postCadastros(params, headers);
};

exports.getEdinheiroAgentes = function (headers) {
  return myData.getEdinheiroAgentes(headers);
}

exports.getEdinheiroSupervidores = function (headers) {
  return myData.getEdinheiroSupervidores(headers);
}

exports.getEdinheiroCadastrosQuery = function (page, headers) {
  return myData.getEdinheiroCadastrosQuery(page, headers)
}

exports.getEdinheiroCadastro = function (id, headers) {
  return myData.getEdinheiroCadastro(id, headers);
}