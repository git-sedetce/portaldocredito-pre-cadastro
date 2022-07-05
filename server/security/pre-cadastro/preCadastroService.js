const myData = require('./preCadastroData');


exports.postUsuario = function(reg, headers){
    return myData.postUsuario(reg, headers);
}