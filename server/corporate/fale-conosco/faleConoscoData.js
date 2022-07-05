const database = require("../../infra/database");
var AWS = require("aws-sdk");
// Set region
AWS.config.update({ region: "sa-east-1" });

exports.postFaleConosco = function (body, headers) {
  console.log(body);
  let sql = ` INSERT INTO crediceara.contactus
                     ("name", descrition, cpf, created_at, subject_id, phone_number,email)
              VALUES ('${body.Nome}', 
              crediceara.fnc_tonull('${body.Descricao}'), 
              crediceara.fnc_tonull('${body.CPF}'),
              now(), 
              ${body.AssuntoId}, 
              crediceara.fnc_tonull('${body.Celular}'),
              crediceara.fnc_tonull('${body.eMail}')) returning * 
  `;

  // return retorno;
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      var params = {
        Destination: {
          ToAddresses: [
            process.env.EMAIL_SUPORTE || "thiago.gomez@sedet.ce.gov.br",
          ],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: ` <img src='https://cadastro.cearacredi.ce.gov.br/assets/images/LogoCeara.png'>&nbsp;&nbsp;<img src='https://cadastro.cearacredi.ce.gov.br/assets/images/LogoGoverno.png'>  
              <hr>
              <p style='padding: 10px'>Fale Conosco </p>
              <p style='padding: 10px'>Assunto: ${body.Assunto}</p>
              <p style='padding: 10px'>Cidadão: ${body.Nome} - CPF: ${body.CPF}</p>
              <p style='padding: 10px'>Celular: ${body.Celular} - e-mail: ${body.eMail}</p>
              <hr>
              <p ><b>Descrição</b></p>
              <p style='padding: 10px'>${body.Descricao}</p>
              `,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: `CearaCredi - Fale conosco #${ret.id}`,
          },
        },
        Source: process.env.SENDER_MAIL, //  "evertonildo@gmail.com",
        // ReplyToAddresses: ["evertonildo@gmail.com"],
      };
      var sendPromise = new AWS.SES() // { apiVersion: "2010-12-01" })
        .sendEmail(params)
        .promise();

      // Handle promise's fulfilled/rejected states
      sendPromise
        .then(function (data) {
          console.log(data.MessageId);
          return {
            codeErro: 0,
            messageId: data.MessageId,
          };
        })
        .catch(function (err) {
          console.error(err, err.stack);
          return {
            codeErro: 1,
            exception: err.stack,
          };
        });

      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => console.log("erro ", e, sql, body));
};

exports.getFaleConoscoList = function (headers) {
  let sql = ` select cus.id, cus.name, cus.descrition, cus.cpf, cus.created_at, cus.subject_id, d.name as subject,  cus.phone_number, cus.email  
                from crediceara.contactus cus
                    left join crediceara.domains d on cus.subject_id = d.domain_id
                    order by cus.created_at `;

  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => console.log("erro ", e, sql));
};
