const myData = require("./userData");

exports.getUsuario = function (id, headers) {
  const registro = myData.getUsuario(id, headers);
  return registro;
};

exports.getUsuarios = function (headers) {
  return myData.getUsuarios(headers);
};

exports.putUsuario = function (id, reg, headers) {
  const registro = myData.putUsuario(id, reg, headers);
  return registro;
};

exports.postResetPasswordAdmin = function (body,  headers){
  return myData.postResetPasswordAdmin(body, headers);
}

exports.deleteUsuario = function (id, headers) {
  return myData.deleteUsuario(id, headers);
};

exports.putUserverify = function (id, headers) {
  return myData.putUserverify(id, headers);
};

exports.putCorrecaoDadosBasicos = function (id, body, headers) {
  return myData.putCorrecaoDadosBasicos(id, body, headers);
};

exports.getPerson = function (perfil, headers) {
  return myData.getPerson(perfil, headers);
};
