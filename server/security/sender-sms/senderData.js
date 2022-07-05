const database = require("../../infra/database");
let nodemailer = require("nodemailer");
// let awsses = require("@aws-sdk/client-ses");

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set region
AWS.config.update({ region: "sa-east-1" });

exports.postSenderSMS = function (body, headers) {
  console.log("postSenderSMS", body);
  let sql = ` --- Atualização de token enviado via SMS
                update crediceara.users
                   set  remember_token = case when coalesce(remember_token, '') = '' then  
                                trim(to_char(floor(random() * (999999-1+1) + 1)::int, '000000'))
                                else remember_token end ,
                   updated_at = now()
                   where cpf = '${body.cpf}' returning * `;

  let dbinfo = {};
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      let code = ret.remember_token;
      // Create publish parameters

      var params = {
        Message: `CearaCredi | Seu código de validação de cadastro é ${code}`,
        PhoneNumber: `+55${body.PhoneNumber}`,
      };

      var sqs = new AWS.SQS();

      var params = {
        // Remove DelaySeconds parameter and value for FIFO queues
        DelaySeconds: 10,
        MessageAttributes: {
          number: {
            DataType: "String",
            StringValue: `+55${body.PhoneNumber}`,
          },
        },
        MessageBody: `CearaCredi | Seu código de validação de cadastro é ${code}`,
        // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
        // MessageGroupId: "Group1",  // Required for FIFO queues
        QueueUrl:
          "https://sqs.sa-east-1.amazonaws.com/527520683957/tramitador-sms",
      };

      sqs.sendMessage(params, function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data.MessageId);
        }
      });
    })
    .catch((e) => {
      console.log(e, sql, body);
      return {
        codeErro: 1,
        message: e,
      };
    });
};

exports.postSenderEMAIL = function (body, headers) {
  console.log("body", body);
  let sql = ` update crediceara.users
                   set  --remember_token = coalesce(remember_token,'')||','|| trim(to_char(floor(random() * (999-1+1) + 1)::int, '000')),
                   updated_at = now()
                   where cpf = '${body.cpf}' returning * `;

  let dbinfo = {};
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      let code = ret.remember_token;
      var params = {
        Destination: { ToAddresses: [body.email] },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `<p><b>Prezado Cidadão</b> </p><p>CearaCredi | Seu código para validação do seu cadastro é ${code}. Esse mesmo código foi enviado para o seu celular</p>`,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Código de validação de cadastro",
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
    })
    .catch((e) => {
      console.log(e);
      return {
        erroCode: 1,
        message: "Não foi possivel enviar o email",
      };
    });
};

exports.getResendCode = function (id, headers) {
  if (id === null)
    return {
      codeErro: 4,
      message: "ID nulo",
    };
  let sql = ` select * from crediceara.users where cpf = '${id}' `;
  let dbinfo = {};
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      if (ret.status === "Confirmado")
        return {
          codeErro: 2,
          message: "O CPF já foi confirmado!",
        };
      else {
        let body = {
          id: ret.id,
          cpf: id,
          PhoneNumber: ret.phone,
          email: ret.email,
        };
        this.postSenderSMS(body, headers);
        this.postSenderEMAIL(body, headers);
        return {
          codeErro: 0,
          id: ret.id,
          message: "Código reenviado com sucesso!",
        };
      }
    })
    .catch((e) => {
      console.log("erro", e, sql);
      return {
        codeErro: 1,
        message: "O CPF não foi localizado na base ",
      };
    });
};

exports.getComunicado = function (headers) {
  let sql = ` select id, name, created_at,cpf, 
                      lower(email) as email, 
                      to_char(birthday, 'dd/MM/yyyy') as birthday, 
                      to_char(total_income, '999g999d99') as total_income, rg
                  from crediceara.users u
                  where coalesce(email,'') <> '' 
                    and elegible = 'S'
                    and status = 'Verificado'
                    and email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'
                    --and (email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$' or email like 'evertonildo%')
                    order by created_at 
                    --limit 1
                    `;

  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      ret.forEach((item) => {
        var params = {
          Destination: { ToAddresses: [item.email] },
          Message: {
            Body: {
              Html: {
                Charset: "UTF-8",
                Data: `<p>Olá ${item.name}!</p>
                <br>
                <p>Confirmamos seu cadastro no Ceará Credi. Agora, você faz parte do grupo de mais de 24 mil empreendedores que vão fazer o seu negócio acontecer.</p>
                
                <p>Vamos continuar o atendimento, conforme os passos abaixo: </p>
                <br>
                🗓️ 📱
                <p><b>1. Agendamento:</b></p>
                <p>O agente de crédito entrará em contato com você via telefone ou WhatsApp para agendar uma entrevista presencial ou virtual.</p>
                <br>
                <p><b>IMPORTANTE:</b> Se vai abrir um novo negócio, precisa fazer os cursos "Desvendando o Crédito" e "Ceará Credi - Ajudando você a pensar no seu negócio". Eles estão disponíveis na plataforma Ceará Credi (https://cearacredi.ce.gov.br). Depois de assistir todas as aulas, você receberá um certificado digital e seu cadastro seguirá para a etapa de agendamento. </p>
                <br>
                <br>
                <br>
                🏠📱
                <p><b>2. Entrevista presencial ou virtual:</b></p>
                <br>
                <p>Você e o agente de crédito irão conversar sobre o seu empreendimento e as condições para aprovar o seu empréstimo. Quer se preparar? O agente vai querer conhecer o seu negócio, a partir de informações como: </p>
                
                <ul>
                  <li>Atividades, produtos e/ou serviços que desenvolve;</li>
                  <li>Quanto pretende tirar emprestado;</li>
                  <li>Em que vai aplicar o dinheiro do crédito;</li>
                  <li>Se o crédito for individual, com avalista, qual nome do seu avalista;</li>
                  <li>Se não tem avalista, você precisa participar de um grupo solidário e apresentar informações sobre o seu grupo;</li>
                  <li>Se vai empreender de forma coletiva, quem são os outros participantes do empreendimento;</li>
                  <li>Valor das vendas por mês;</li>
                  <li>Gastos por mês; e</li>
                  <li>Quanto acha que pode pagar de prestação por seu empréstimo.</li>
                </ul>
                <br>
                
                ✅ 📱
                <p><b>3. Aprovação e liberação</b></p>
                <br>
                <p>Após a entrevista sua proposta será analisada. Em caso de aprovação, você será comunicado via e-mail, telefone ou WhatsApp. Em seguida, o contrato poderá ser assinado de forma presencial ou virtual, para liberação na sua conta digital pelo aplicativo E-Dinheiro.</p>
                <br>
                <br>
                <br>
                <p>Aproveite para fazer os cursos gratuitos, disponíveis na plataforma Ceará Credi (https://cearacredi.ce.gov.br), enquanto espera o nosso contato. </p>
                
                <p>Segue alguns dados que você informou. Caso tenha algo para corrigir, entre no sistema com seu email e senha para fazer as devidas correções</p>

                <div style="border-radius: 15px; border: 1px black solid; padding: 20px;">
                <p>Nome completo informado: <b>${item.name}</b></p>
                <p>e-mail informado: <b>${item.email}</b></p>
                <p>CPF informado: <b>${item.cpf}</b></p>
                <p>RG informado: <b>${item.rg}</b></p>
                <p>Data de nascimento informada: <b>${item.birthday}</b></p>
                <p>Renda informada: <b>${item.total_income}</b></p>
                </div>
                <br>
                <br>
                
                <p>📞 Esse e-mail é apenas informativo, em caso de dúvidas, fale com a gente através da Ouvidoria: </p>
                <p>ouvidoria.geral@cge.ce.gov.br</p>
                <p>Central de atendimento 155</p>
                <br>
                <br>
                
                <p>Queremos ver o seu negócio acontecer! </p>
                <p>Ceará Credi</p>
                `,
              },
            },
            Subject: {
              Charset: "UTF-8",
              Data: "Código de validação de cadastro",
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
      });
      return {
        codeErro: 0,
        totalRegistros: ret.length,
        message: "Emails enviados com sucesso !",
      };
    })
    .catch((e) => {
      return {
        codeErro: 1,
        messagem: "Problema no envio dos emails",
        exception: e,
        ex: e.stack,
      };
    });
};

/**
 * 
 let transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.HOST_SMTP_SERVER,
  port: process.env.HOST_SMTP_PORT, //465,
  secure: true, // use TLS
  auth: {
    user: process.env.USER_ID // "evertonildo@gmail.com",
    pass: process.env.USER_PASSWORD, //"S1ph23nm@3"
  }
  
    // Message object
    let message = {
        from: 'CearaCredi',
        // Comma separated list of recipients
        to: '${body.Nome} <${body.email}>',
        bcc: 'evertonildo@gmail.com',
        // Subject of the message
        subject: 'Código de verificação de cadastro',
        // plaintext body
        text: 'CearaCredi | Seu código para validação do seu cadastro é ${code}. Esse mesmo código foi enviado para o seu celular',

        // HTML body
        html:
            '<p><b>Prezado Cidadão</b> </p>' +
            '<p>CearaCredi | Seu código para validação do seu cadastro é ${code}. Esse mesmo código foi enviado para o seu celular</p>',

        
    };

    let info = await transporter.sendMail(message);
});
 */

/**
 * // Create promise and SNS service object
      /*var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
        .publish(params)
        .promise();
      let messageId = "";
      // Handle promise's fulfilled/rejected states
      publishTextPromise
        .then(function (data) {
          messageId = data.MessageId;
          sql = ` --- Atualização de sms_sended enviado via SMS
                  update crediceara.users
                    set  sms_sended = 'S',                    
                    updated_at = now(), 
                where cpf = '${body.cpf}' returning *  `;
          return database()
            .one(sql)
            .then((r) => r)
            .then((ret) => {
              return {
                codeErro: 0,
                user: ret,
                id: ret.id,
                message: "SMS enviado com sucesso!",
              };
            })
            .catch((e) => {
              return {
                codeErro: 1,
                exception: e,
                message: "SMS não poder ser enviado!",
              };
            });
        })
        .catch(function (err) {
          return {
            codeErro: 1,
            exception: err,
            message: "SMS não poder ser enviado!",
          };
        });*/
