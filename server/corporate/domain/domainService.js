const myData = require("./domainData");

exports.getDomains = function (nome, headers) {
  const lista = myData.getDomains(nome, headers);

  return lista;
};

exports.getKindOfDomain = function (headers) {
  const lista = myData.getKindOfDomain(headers);
  return lista;
};

exports.postConsultaCEP = function (body, headers) {
  return myData.postConsultaCEP(body, headers);
};

exports.getCeps = function (headers) {
  return myData.getCeps(headers);
};

exports.postDomain = function (body, headers) {
  return myData.postDomain(body, headers);
};

exports.putDomain = function(id, body, headers){
    return myData.putDomain(id, body, headers);
}

exports.deleteDomain = function(id,  headers){
  return myData.deleteDomain(id, headers);
}