const database = require("../../infra/database");

exports.postUsuario = async function (reg, headers) {
  console.log("reg", reg);
  let sql = ` select id from crediceara.users where cpf = '${reg.CPF}' `;
  let retorno = await database()
    .oneOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      console.log("teste cpf", ret);
      return ret;
    })
    .catch((e) => {
      console.log("erro", e);
    });
  console.log("teste cpf retorno", retorno);
  if (retorno && retorno.id)
    return {
      codeErro: 1,
      message: "CPF já cadastrado !",
    };

  sql = ` select id from crediceara.users where email = '${reg.eMail}' `;
  retorno = await database()
    .oneOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      console.log("teste email", ret);
      return ret;
    })
    .catch((e) => {
      console.log("erro", e);
    });
  console.log("teste cpf retorno", retorno);
  if (retorno && retorno.id)
    return {
      codeErro: 1,
      message: "e-mail já cadastrado !",
    };

  sql = `  INSERT INTO crediceara.users ("name", email, cpf, phone, "password", status, birthday, profile_id)
  VALUES( '${reg.Nome}', 
          '${reg.eMail}', 
          '${reg.CPF}', 
          '${reg.Celular}', 
          '${reg.password}',   
          'Aguardando Confirmação', 
          '${reg.DataNascimento}'::text::date,
          crediceara.fnc_getdominioid('Cidadão', 'PerfilUsuario')) returning *   `;

  const dbinfo = {};
  return database()
    .oneOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        dbinfo: dbinfo,
        codeErro: 0,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, reg);
      return {
        codeErro: 1,
        message: e,
        //sql : sql,
        // reg: reg
      };
    });
};
