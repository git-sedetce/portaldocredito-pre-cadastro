const myData = require("./jurisdicaoData");

exports.getEdinheiroCadastros = function (param, headers) {
  return myData.getEdinheiroCadastros(param, headers);
};

exports.postJurisdicao = function (body, headers) {
  return myData.postJurisdicao(body, headers);
};

exports.putJurisdicao = function (id, body, headers) {
  return myData.putJurisdicao(id, body, headers);
};

exports.getJuristicoes = function (headers) {
  return myData.getJuristicoes(headers);
};

exports.getJuristicao = function (id, headers) {
  return myData.getJuristicao(id, headers);
};

exports.getMunicipiosDisponiveis = function (headers) {
  return myData.getMunicipiosDisponiveis(headers);
};

exports.getMunicipiosVinculados = function (id, headers) {
  return myData.getMunicipiosVinculados(id, headers);
};

exports.postJurisdicaoLocal = function (body, headers) {
  return myData.postJurisdicaoLocal(body, headers);
};

exports.postJurisdicaoBairro = function (body, headers) {
  return myData.postJurisdicaoBairro(body, headers);
};

exports.deleteJurisdicaoLocal = function (id, headers) {
  return myData.deleteJurisdicaoLocal(id, headers);
};

exports.deleteJurisdicaoBairro = function (id, headers) {
  return myData.deleteJurisdicaoBairro(id, headers);
};

exports.getBairrosDisponiveis = function (headers) {
  return myData.getBairrosDisponiveis(headers);
};

exports.getBairrosVinculados = function (id, headers) {
  return myData.getBairrosVinculados(id, headers);
};

exports.postJurisdicaoAgente = function (body, headers) {
  return myData.postJurisdicaoAgente(body, headers);
};

exports.deleteJurisdicaoAgente = function (id, headers) {
  return myData.deleteJurisdicaoAgente(id, headers);
};

exports.getAgentesDisponiveis = function (headers) {
  return myData.getAgentesDisponiveis(headers);
};

exports.getAgentesVinculados = function (id, headers) {
  return myData.getAgentesVinculados(id, headers);
};

exports.getMinhaJurisdicao = function (body, headers) {
  return myData.getMinhaJurisdicao(body, headers);
};

exports.getAgentesJurisdicao = function (id, headers) {
  return myData.getAgentesJurisdicao(id, headers);
};

exports.postAgentesJurisdicao = function (body, headers) {
  return myData.postAgentesJurisdicao(body, headers);
}

exports.getAtribuirParaMim = function (id, body, headers) {
  return myData.getAtribuirParaMim(id, body, headers);
};
