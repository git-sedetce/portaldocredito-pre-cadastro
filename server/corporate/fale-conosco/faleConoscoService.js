const myData = require("./faleConoscoData");

exports.postFaleConosco = function (body, headers) {
  return myData.postFaleConosco(body, headers);
};

exports.getFaleConoscoList = function (headers) {
  return myData.getFaleConoscoList(headers);
}

