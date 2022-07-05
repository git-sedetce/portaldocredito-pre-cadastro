const database = require("../../infra/database");
const jwt = require("jsonwebtoken");
const sms = require("../sender-sms/senderData");

// var generate = require("gerador-validador-cpf");
// var validate = require("gerador-validador-cpf");
const CPF = require("cpf");

var dbinfo = {};

exports.codeVerify = async function (body, headers) {
  console.log(body);
  let codigo = body.codigo.toString().replace(".", "");
  let sql = ` select id from crediceara.users  where cpf = '${body.cpf}' and remember_token like '%${body.codigo}%'`;
  let dbinfo = {};
  let retorno = await database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      console.log(ret);
      body.id = ret.id;
      sql = ` update crediceara.users 
                  set updated_at = now(), 
                      status = 'Verificado', 
                      email_verified_at = now() 
                      where id = ${body.id} returning * `;
      return database()
        .one(sql)
        .then((r) => r)
        .then((ret) => {
          return {
            codeErro: 0,
            user: ret,
            id: ret.id,
            message: "Usuário encontrado",
          };
        })
        .catch((ee) => {
          return {
            codeErro: 1,
            message: "erro ao atualizar o registro do usuario",
          };
        });
    })
    .catch((e) => {
      console.log(e);
      return {
        codeErro: 1,
        message: e,
        dbinfo: dbinfo,
      };
    });
  console.log("user", retorno);
  if (retorno.codeErro === 1) {
    return retorno;
  } else {
    if (
      retorno.user.email_verified_at !== null ||
      retorno.user.phone_verified_at !== null
    ) {
      retorno.message = "O usuário já havia sido verificado!";
      return retorno;
    } else {
      sql = ` update crediceara.users 
                    set email_verified_at = now(),
                        status = 'Confirmado'
                where id = ${retorno.user.id} returning *`;
      return database()
        .one(sql)
        .then((r) => r)
        .then((ret) => {
          return {
            codeErro: 0,
            id: retorno.id,
            user: retorno,
            registro: ret,
            dbinfo: dbinfo,
            message: "Validação OK",
          };
        })
        .catch((e) => {
          return {
            codeErro: 1,
            message: e.detail,
            dbinfo: dbinfo,
            sql: sql,
          };
        });
    }
  }
};

exports.postLoginByToken = function (body, headers) {
  console.log(body);
  let sql = `
    select id, 
          "name" as "Nome", 
          social_name as "NomeSocial",
          phone as "Celular", 
          email from crediceara.users where lower(email) = lower('${body.emails[0]}');
  `;
  // console.log(sql);
  let dbinfo = {};
  return database()
    .oneOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      // console.log("buscando", ret);
      if (!ret) {
        sql = `insert into crediceara.users 
                (cpf, created_at, email, "name", phone, status, "password") 
                values ('${body.cpf}', now(), lower('${body.emails[0]}'), 
                '${body.given_name}','${body.phone}' , '${body.login_from}', md5('${body.cpf}'))
                returning * `;
        // console.log(sql);
        return database()
          .oneOrNone(sql)
          .then((r) => r)
          .then((reg) => {
            return {
              codeErro: 0,
              user: reg,
              id: reg.id,
              message: "Usuário encontrado",
            };
          })
          .catch((e) => {
            let reg = {
              dbinfo: dbinfo,
              codeErro: 1,
              erro: e,
              sql: sql,
            };
            console.log("error", reg);
            return;
          });
      } else {
        return {
          codeErro: 0,
          user: ret,
          id: ret.id,
          message: "Usuário encontrado",
        };
      }
    })
    .catch((e) => {
      console.log(e);
      return {
        codeErro: 1,
        message: "Usuário não encontrado",
        dbinfo: dbinfo,
        sql: sql,
      };
    });
};

exports.postLogin = function (body, headers) {
  // console.log(body);
  let sql = `   select id, 
                        tu."name" as "Nome", 
                        tu.social_name as "NomeSocial", 
                        tu.phone as "Celular", 
                        tu.email, tu.cpf, 
                        tu.updated_at,
                        case when tu.updated_at is not null and coalesce(mother_name, '') <> '' and tu.status = 'Aguardando Confirmação' then 'Verificado' else tu.status end as status, 
                        case when tu.profile_id is null then 'Cidadão' else td.name end as "Perfil" 
                  from crediceara.users tu 
                        left join crediceara.domains td 
                            on tu.profile_id = td.domain_id
                  where (lower(email) = lower('${body.eMail}') or lower(cpf) = lower('${body.eMail}')) and "password" = '${body.password}' 
  `;
  let dbinfo = {};
  return database()
    .oneOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      if (ret)
        return {
          codeErro: 0,
          user: ret,
          id: ret.id,
          message: "Usuário encontrado",
        };
      else
        return {
          codeErro: 1,
          message: "Usuário não encontrado. Verifique os dados informados.",
        };
    })
    .catch((e) => {
      console.log(e, sql, body);
      return {
        codeErro: 1,
        message: e.message,
      };
    });
};

exports.getJwtCheck = function (id, headers) {
  console.log("id", id);
  //if (id === 0) {
  let load = {
    cpf: CPF.generate(false, false),
    phone: CPF.generate(false, false).substring(0, 10),
    given_name: "Fulado de Tal " + Math.floor(Math.random() * 1000),
    vinculos: [],
    login_from: "Citizen Access",
    emails: ["evertonldo+" + Math.floor(Math.random() * 1000) + "@gmail.com"],
  };

  var token = jwt.sign(load, "HS512");
  // } else {
  //   var decoded = jwt.verify(id, "shhhhh");
  //   console.log(decoded); // bar
  // }
  return { token: token, gerado: id === 0, validado: id > 0 };
};

exports.postToChangePassword = function (body, headers) {
  console.log(body);
  let sql = ` update crediceara.users 
                 set password = '${body.password}' 
              where cpf = '${body.cpf}' and remember_token like '%${body.codigo}%' returning *`;
  return database(dbinfo)
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        message: "Sua senha foi trocada com sucesso!",
      };
    })
    .catch((e) => {
      console.log("postToChangePassword", sql, e, body);
      return {
        codeErro: 1,
        message:
          "Não foi possível trocar sua senha, verifique os dados informados.",
      };
    });
};

exports.postToChangePerfil = function (body, headers) {
  console.log(body);
  let sql = ` update crediceara.users 
                 set profile_id = '${body.PerfilId}' , 
                     status = 'Verificado'
              where cpf = '${body.cpf}' returning *`;
  return database(dbinfo)
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        message: "O perfil foi alterado!",
      };
    })
    .catch((e) => {
      console.log("postToChangePerfil", sql, e, body);
      return {
        codeErro: 1,
        message:
          "Não foi possível trocar o perfil, verifique os dados informados.",
      };
    });
};

exports.postRequestCodeNewPassword = async function (body, headers) {
  let sql = ` select id, name, status, cpf, phone, email from crediceara.users where cpf = '${body.cpf}'`;

  // update crediceara.user   set password = '${body.password}' where cpf = '${body.cpf}' and remember_token like '${body.codigo}' returning *`;

  return database(dbinfo)
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      if (ret.status !== "Verificado")
        return {
          codeErro: 1,
          message:
            "Seu pre-cadastro ainda não foi verificado. Informe o código recebido ou solicite um novo",
        };
      else {
        body.PhoneNumber = ret.phone;
        body.email = ret.email;
        let retSMS = null;
        let retEmail = null;
        try {
          retSMS = sms.postSenderSMS(body, headers);
        } catch (error) {
          retSMS = erro;
        }

        try {
          retEmail = sms.postSenderEmail(body, headers);
        } catch (error) {
          retEmail = error;
        }
        return {
          codeErro: 0,
          message: `Foi enviado um codigo para o email ${body.email} e um SMS para o Celular ${body.PhoneNumber}`,
          retornoSMS: retSMS,
          retornoEmail: retEmail,
        };
      }
    })
    .catch((e) => {
      console.log("postRequestCodeNewPassword", sql, e, body);
      return {
        codeErro: 1,
        message: "CPF não encontrado.",
      };
    });
};

/* 63854945353
-- 452136

-- Gilmarrauber@gmail.com
*/
