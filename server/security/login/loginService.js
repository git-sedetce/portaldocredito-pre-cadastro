const loginData = require("./loginData");

exports.codeVerify = function (body, headers) {
  return loginData.codeVerify(body, headers);
};

exports.postLoginByToken = function (body, headers) {
  return loginData.postLoginByToken(body, headers);
};

exports.postLogin = function (body, headers) {
  return loginData.postLogin(body, headers);
};

exports.getJwtCheck = function (id, headers) {
  return loginData.getJwtCheck(id, headers);
};

exports.postToChangePerfil = function (body, headers) {
  return loginData.postToChangePerfil(body, headers);
}

exports.postToChangePassword = function (body, headers) {
  return loginData.postToChangePassword(body, headers);
}



exports.postRequestCodeNewPassword = function (body, headers) {
  return loginData.postRequestCodeNewPassword(body, headers);
}
