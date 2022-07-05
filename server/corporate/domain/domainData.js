const database = require("../../infra/database");

exports.deleteDomain = function (id, headers) {
  let sql = ` 
     delete from crediceara.domains where domain_id = ${id}
  `;
  let dbinfo = {};
  return database()
    .none(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        dbinfo: dbinfo,
        codeErro: 0,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
      };
    });
};
exports.postDomain = function (body, headers) {
  let sql = ` INSERT INTO crediceara.domains
                     (code, "name", descrition, domain_flg, created_at, domain_value, domain_type, domain_fk, 
                     is_deleted, start_at, concluded_at, domain_nick, updated_at, is_active)
              VALUES (crediceara.fnc_tonull('${body.code}'), 
              crediceara.fnc_tonull('${body.name}'), 
              crediceara.fnc_tonull(''), 
              crediceara.fnc_tonull(''), 
              now(), 
              null, 
              crediceara.fnc_tonull('${body.domain_type}'), 
              null, 'N', 'now'::text::date, 
              null, 
              crediceara.fnc_tonull(''), 
              null, 'S') returning * 
  `;
  let dbinfo = {};
  // return retorno;
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        dbinfo: dbinfo,
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => console.log("erro ", e, sql, body));
};

exports.putDomain = function (id, body, hedaers) {
  let sql = ` UPDATE crediceara.domains
                 SET code=crediceara.fnc_tonull('${body.code}'), 
                     "name"=crediceara.fnc_tonull('${body.name}'), 
                     descrition=crediceara.fnc_tonull(''), 
                     domain_flg=crediceara.fnc_tonull(''), 
                     domain_value=null, 
                     domain_fk=null, 
                     domain_type=crediceara.fnc_tonull('${body.domain_type}'), 
                     updated_at=now(), 
                     is_active='S'::bpchar
               WHERE domain_id= ${id} returning *;
  `;
  let dbinfo = {};
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        dbinfo: dbinfo,
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => console.log("erro ", e, sql));
};

exports.getDomains = function (nome, headers) {
  let sql = `select tp.domain_id, 
                    tp.domain_id as id,
                    tp.code,
                    tp."name",
                    tp."name" as texto,
                    tp.descrition,
                    tp.domain_flg,
                    tp.created_at,
                    tp.domain_value,
                    tp.domain_type,
                    tp.domain_fk,
                    tp.is_deleted,
                    tp.start_at,
                    tp.concluded_at,
                    tp.domain_nick,
                    tp.updated_at,
                    tp.is_active,
                    tpar."name" as parent
                  from
                    crediceara.domains tp
                  left join crediceara.domains tpar on
                    tp.domain_fk = tpar.domain_id
                  where lower(tp.domain_type) = lower('${nome}') 
                  order by tp.name `;
  let dbinfo = {};
  // return retorno;
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        dbinfo: dbinfo,
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => console.log("erro ", e, sql));
};

exports.getKindOfDomain = function (headers) {
  let sql = ` select distinct domain_type as id, domain_type as texto from crediceara.domains order by 1;`;
  let dbinfo = {};
  // return retorno;
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        dbinfo: dbinfo,
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => console.log("erro ", e, sql));
};

exports.postConsultaCEP = function (body, headers) {
  let sql = ` select * from crediceara.ceps where cep = '${body.cep}' `;
  let dbinfo = {};
  return database()
    .oneOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      if (ret === null) {
        sql = ` INSERT INTO crediceara.ceps
                      (cep, bairro, complemento, ddd, ibge, localidade, logradouro, uf)
                VALUES('${body.cep}', '${body.bairro}', '${body.complemento}', '${body.ddd}', '${body.ibge}', '${body.localidade}', '${body.logradouro}', '${body.uf}') returning *   `;
        return database()
          .one(sql)
          .then((r) => r)
          .then((novo) => {
            return { novo: true, registro: novo };
          })
          .catch((ee) => {
            console.log("erro no insert", ee);
          });
      } else {
        return {
          novo: false,
          lista: ret,
        };
      }
    })
    .catch((e) => console.log("erro ", e, sql));
};

exports.getCeps = function (headers) {
  let sql = ` select * from crediceara.ceps order by localidade, bairro`;
  let dbinfo = {};
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        lista: ret,
      };
    })
    .catch((e) => {
      console.log(e);
      return {
        erroCode: 1,
        exception: e,
      };
    });
};
