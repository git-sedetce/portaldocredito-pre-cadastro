const myData = require("./senderData");

exports.postSenderSMS = function (body, headers) {
  return myData.postSenderSMS(body, headers);
};

exports.postSenderEMAIL = function (body, headers) {
  return myData.postSenderEMAIL(body, headers);
};

exports.getResendCode = function (id, headers) {
  return myData.getResendCode(id, headers);
};

exports.getComunicado = function (headers) {
  return myData.getComunicado(headers);
}

exports.postCodeNewPassword = function (body, headers) {
  return myData.postCodeNewPassword(body, headers);
}
