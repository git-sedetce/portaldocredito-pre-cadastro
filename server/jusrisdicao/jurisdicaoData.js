const database = require("../infra/database");

exports.getJurisdicao = function (id, headers) {
  let sql = `SELECT id, "name", 
                    post, 
                    supervisor, 
                    created_at
              FROM crediceara.jurisdiction jus
                  join crediceara.domains tp on jus.post = tp.domain_id
                  join crediceara.users sup on jus.supervidor = sup.id 
              where id = '${id}   `;

  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, id);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getJurisdicoes = function (headers) {
  let sql = `SELECT jus.id, 
                    jus."name", 
                    jus.post, 
                    jus.supervisor , 
                    jus.created_at,
                    tp.name as posto,
                    sup.name as supervidornome
              FROM crediceara.jurisdiction jus
                    join crediceara.domains tp on jus.post = tp.domain_id
                    join crediceara.users sup on jus.supervisor = sup.id 
              order by 1`;

  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getJuristicao = function (id, headers) {
  let sql = ` SELECT jus.id, 
                    jus."name", 
                    jus.post, 
                    jus.supervisor , 
                    jus.created_at,
                    tp.name as posto,
                    sup.name as supervidornome
                  FROM crediceara.jurisdiction jus
                  join crediceara.domains tp on jus.post = tp.domain_id
                  join crediceara.users sup on jus.supervisor = sup.id  
                  where jus.id = ${id}`;
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.postJurisdicao = function (body, headers) {
  let sql = `INSERT INTO crediceara.jurisdiction
                ("name", post, supervisor, created_at, regional_id, city_id)
          VALUES('${body.Nome}', ${body.PostoId}, ${body.SupervisorId}, now(), ${body.RegiaoId}, ${body.SedeId}) returning *
  `;

  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, body);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.putJurisdicao = function (id, body, headers) {
  let sql = `UPDATE crediceara.jurisdiction
                SET post=${body.PostoId}, 
                    supervisor=${body.SupervisorId}, 
                    regional_id = ${body.RegiaoId},
                    city_id = ${body.SedeId}
              WHERE id=${id} returning *  
  `;

  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, body);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.postJurisdicaoLocal = function (body, headers) {
  let sql = ` INSERT INTO crediceara.jurisdiction_locality
                (jurisdiction_id, locality, created_at)
          VALUES(${body.jurisdicaoId}, ${body.municipio}, now()) returning *`;

  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      sql = ` INSERT INTO crediceara.jurisdiction_wallet_client 
              (client_id, created_at, jurisdiction_locality)
                    select id, now(), ${ret.id} from crediceara.users where city_id = ${body.municipio}      `;
      let exec = database()
        .none(sql)
        .then((r) => r)
        .catch((err) => console.log(err));
      return {
        codeErro: 0,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, body);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.postJurisdicaoBairro = function (body, headers) {
  let sql = ` INSERT INTO crediceara.jurisdiction_locality
                (jurisdiction_id, locality, created_at)
          VALUES(${body.jurisdicaoId}, crediceara.fnc_getdominioid('${body.bairro}', 'JurisdicaoBairro'), now()) returning *`;

  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      sql = ` INSERT INTO crediceara.jurisdiction_wallet_client 
                (client_id, created_at, jurisdiction_locality)
              select id, now(), ${ret.id} 
                from crediceara.users u
                      join crediceara.domains d on u.city_id = d.domain_id
                      where lower(u.neighbor) = lower('${body.bairro}')
                        and lower(d."name")   = lower('Fortaleza') 
                        and u.id not in (select client_id from crediceara.jurisdiction_wallet_client )`;
      console.log(sql);

      let exec = database()
        .none(sql)
        .then((r) => r)
        .catch((err) => console.log(err));

      return {
        codeErro: 0,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, body);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getJuristicoes = function (headers) {
  let sql = ` select j.*, d2.name as regional, 
                    u.name as supervisorName, d.name as posto, d3.name as sede, 
                    (select count(*) from crediceara.jurisdiction_locality jl where jurisdiction_id = j.id) as locais,
                    (select count(*) from crediceara.jurisdiction_wallet jw where jurisdiction_id = j.id) as agentes,
                    (select count(*) from crediceara.jurisdiction_locality jl2 
                    join crediceara.jurisdiction_wallet_client jwc on jl2.id = jwc.jurisdiction_locality 
                    join crediceara.users u on jwc.client_id = u.id
                    where jl2.jurisdiction_id = j.id
                    and u.status = 'Verificado') as clientes
              from crediceara.jurisdiction j 
                  left join crediceara.domains d on j.post  = d.domain_id
                  left join crediceara.users u on j.supervisor = u.id 
                  left join crediceara.domains d2 on j.regional_id = d2.domain_id
                  left join crediceara.domains d3 on j.city_id = d3.domain_id
                  order by d.name `;
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getMinhaJurisdicao = function (body, headers) {
  let sql = ` select d3."name" as regional, d."name" as sede, d2."name" as posto, u.id , u."name" , u.cpf , u.email , u.phone , u.total_income ,
              u.mother_name, u.created_at,  u.sexo, u.page , u.elegible, u.dth_envio_edinheiro , u.dth_retorno_edinheiro, u2.name as agente,
              j.id as jurisdict_id , d4.name as municipio
        from crediceara.jurisdiction_wallet jw 
            join crediceara.jurisdiction j on jw.jurisdiction_id = j.id 
            join crediceara.jurisdiction_locality jl on jw.jurisdiction_id = jl.jurisdiction_id 
            join crediceara.users u on jl.locality = u.city_id
            join crediceara.domains d on j.city_id = d.domain_id
            join crediceara.domains d3 on j.regional_id = d3.domain_id 
            join crediceara.domains d2 on j.post = d2.domain_id 
            left join crediceara.domains d4 on u.city_id = d4.domain_id
            left join crediceara.users u2 on u.agent_id = u2.id
     where (jw.agent_id = ${body.id} or j.supervisor = ${body.id}) 
       and u.status = 'Verificado'
    -- order by u."name" 
    `;

  if (body.haveBussiness) sql += ` and coalesce(u.have_company, 'N') = 'S'`;
  else sql += ` and coalesce(u.have_company,'N') = 'N'`;

  if (body.haveLoan) sql += ` and coalesce(u.have_loan, 'N') = 'S'`;
  else sql += ` and coalesce(u.have_loan,'N') = 'N'`;

  if (body.enviados) sql += ` and u.dth_envio_edinheiro is not null `;
  

  sql += " order by u.name";

  console.log("getMinhaJurisdicao", sql, body);
  return database()
    .query(sql)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getMunicipiosDisponiveis = function (headers) {
  let sql = ` select d.domain_id , d2.name as regiao,  d.name as municipio
                from crediceara.domains d 
                    join crediceara.domains d2 on d.domain_fk = d2.domain_id 
                where d.domain_type = 'Municipio' and d.domain_id not in (select locality from crediceara.jurisdiction_locality jl)
                order by 2, 3 `;
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      // console.log(ret);
      var regiao = "";
      var lista = [];
      var reg = { regiao: "", municipios: [] };
      ret.forEach((item) => {
        if (item.regiao !== regiao) {
          if (regiao !== "") {
            lista.push(reg);
          }
          reg = { regiao: "", municipios: [] };
          reg.regiao = item.regiao;
          reg.municipios = [];
          regiao = item.regiao;
        }
        reg.municipios.push({ id: item.domain_id, texto: item.municipio });
      });
      lista.push(reg);
      return {
        codeErro: 0,
        lista: lista,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getMunicipiosVinculados = function (id, headers) {
  let sql = ` select j.id , d2.name as texto
                from crediceara.jurisdiction_locality j 
                    join crediceara.domains d2 on j.locality = d2.domain_id 
                where j.jurisdiction_id = ${id}
               order by 2 `;
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.deleteJurisdicaoLocal = function (id, headers) {
  let sql = `delete from crediceara.jurisdiction_wallet_client jwc where jwc.jurisdiction_locality = ${id}`;
  return database()
    .none(sql)
    .then((r) => r)
    .then((ret) => {
      sql = `  delete from crediceara.jurisdiction_locality where id = ${id} `;
      let _ret = database()
        .none(sql)
        .then((r) => r)
        .catch((t) => console.log(t, id));
      return {
        codeErro: 0,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.deleteJurisdicaoBairro = function (id, headers) {
  let sql = `delete from crediceara.jurisdiction_wallet_client jwc 
                where jurisdiction_locality = (select id from crediceara.jurisdiction_locality 
                             where locality = crediceara.fnc_getdominioid('${id}', 'JurisdicaoBairro')) `;
  return database()
    .none(sql)
    .then((r) => r)
    .then((ret) => {
      sql = `  delete from crediceara.jurisdiction_locality 
                where locality = crediceara.fnc_getdominioid('${id}', 'JurisdicaoBairro') `;
      let _ret = database()
        .none(sql)
        .then((r) => r)
        .catch((t) => console.log(t, sql, id));
      return {
        codeErro: 0,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, id);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getBairrosDisponiveis = function (headers) {
  let sql = ` select distinct c.bairro as texto
                from crediceara.domains d
                  join crediceara.ceps c on lower(d.name) = lower(c.localidade) 
              where domain_type = 'Municipio' and lower(d.name) = 'fortaleza'
              and lower(trim(crediceara.buscasemacento(c.bairro))) not  in (select lower(trim(crediceara.buscasemacento(d2.name))) 
                                from crediceara.jurisdiction_locality jl 
                                  join crediceara.domains d2 on jl.locality = d2.domain_id)
              order by 1`;
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getBairrosVinculados = function (id, headers) {
  let sql = ` select jl.id, d2.name as texto
              from crediceara.jurisdiction_locality jl 
                join crediceara.domains d2 on jl.locality = d2.domain_id
                where jl.jurisdiction_id = ${id}
              order by 2 `;
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.postJurisdicaoAgente = function (body, headers) {
  let sql = ` INSERT INTO crediceara.jurisdiction_wallet
                (jurisdiction_id, agent_id, created_at)
              VALUES(${body.jurisdicaoId}, ${body.agenteId}, now()) returning *  `;
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, body);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.deleteJurisdicaoAgente = function (id, headers) {
  let sql = ` delete from crediceara.jurisdiction_wallet where id = ${id}`;
  return database()
    .none(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getAgentesDisponiveis = function (headers) {
  let sql = ` select users.id, users.name as texto 
                from crediceara.users users
                  join crediceara.domains d on users.profile_id = d.domain_id 
                where d.domain_type = 'PerfilUsuario' and d."name" = 'Agente de Crédito'
                and users.id not in (select agent_id from crediceara.jurisdiction_wallet jw) 
                order by users.name `;
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getAgentesVinculados = function (id, headers) {
  let sql = ` select jw.id, users.name as texto 
                from crediceara.jurisdiction_wallet jw
                    join crediceara.users users on jw.agent_id  = users.id 
                where jw.jurisdiction_id = ${id} order by 2 `;
  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getAgentesJurisdicao = function (id, headers) {
  let sql = ` select u.id, u."name" as texto
                from crediceara.jurisdiction_wallet jw 
 		              join crediceara.users u on jw.agent_id = u.id
              where jw.jurisdiction_id = ${id}
            order by u."name" `;

  return database()
    .query(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, id);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.getAtribuirParaMim = function (id, body, headers) {
  let sql = ` update crediceara.users set agent_id = ${body.agente} where id = ${id} returning * `;

  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, id, body);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};

exports.postAgentesJurisdicao = function (body, headers) {
  let sql = ` update crediceara.users set agent_id = ${body.AgenteId} where id = ${body.UserId} returning * `;

  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, id, body);
      return {
        codeErro: 1,
        exception: e,
      };
    });
};
