const myData = require("./dashboardData");

exports.getDashboardLogin = function (headers) {
  return myData.getDashboardLogin(headers);
};

exports.getDashboardHoje = function (id, headers) {
  return myData.getDashboardHoje(id, headers);
};

exports.getCargaBI = function (headers) {
  return myData.getCargaBI(headers);
};

exports.getPorRegional = function (headers) {
  const lista = myData.getPorRegional(headers);
  return lista;
};

exports.getMediaHoraria = function (headers) {
  return myData.getMediaHoraria(headers);
};

exports.getCargaBIReduzida = function (headers) {
  return myData.getCargaBIReduzida(headers);
};

exports.getBigChart = function (headers) {
  return myData.getBigChart(headers);
}

exports.getPorRegionalDetalhes = function (headers) {
  return myData.getPorRegionalDetalhes(headers);
}
