const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
require("dotenv").config();
const app = express();
const listEndpoints = require("express-list-endpoints"); // npm i express-list-endpoints

var whitelist = [
  "http://hom-portal-do-credito-pre-cadastro.s3-website-sa-east-1.amazonaws.com",
  "https://cadastro.cearacredi.ce.gov.br",
  "https://prod-portal-do-credito-pre-cadastro.s3-sa-east-1.amazonaws.com",
  "http://localhost:4202",
]; //process.env.WHITE_LIST;

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      // || origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error("Acesso negado à API " + origin));
      //callback(null, false);
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET, PUT, POST, DELETE",
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
};

/*var allowlist = [
  "http://hom-portal-do-credito-pre-cadastro.s3-website-sa-east-1.amazonaws.com",
  "http://localhost:4202"
];
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
*/
app.use(express.json());

app.use(cors()); // utilizando cors padrão
// app.use(cors(corsOptionsDelegate));

/*app.use(function (req, res, next) {
  //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});*/
/*app.use("/", function(req, res){
  res.json({
    message: 'Serviço Online at '+ new Date()
  });
});*/
app.use("/", require("./corporate/domain/domainRouters"));
app.use("/", require("./corporate/fale-conosco/faleConoscoRouters"));
app.use("/", require("./e-dinheiro/e-dinheiroRouters"));
app.use("/", require("./security/login/loginRouters"));
app.use("/", require("./security/user/userRouters"));
app.use("/", require("./security/sender-sms/senderRouters"));
app.use("/", require("./security/pre-cadastro/preCadastroRouters"));
app.use("/", require("./dashboard/dashboardRouters"));
app.use("/", require("./jusrisdicao/jurisdicaoRouters"));

/*
app.listen(process.env.PORT || 3000, function () {
  console.clear();
  console.log("Now, this server is on-line at "); // });

  console.log("----- rotas -----");
  let list = listEndpoints(app);
  let index = 0;
  let conta = 0;
  list.forEach((rota) => {
    index++;
    conta = conta + rota.methods.length;
    console.log("path ", rota.path, " methods", rota.methods, index);
  });
  console.log("Total de Endpoints", conta);
});

*/
module.exports.handler = serverless(app);
