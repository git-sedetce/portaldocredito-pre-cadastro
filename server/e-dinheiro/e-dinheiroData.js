const database = require("../infra/database");

exports.getEdinheiroCadastros = function (params, headers) {
  let todos = params.date === "2021-01-01";

  let sql = `select * from crediceara.vi_dados_edinheiro limit 100`;

  return database()
    .manyOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      let ids = "";
      ret.forEach((element) => {
        // console.log('2. element', element);
        ids = ids + (ids === "" ? "" : ",") + element.id;
      });
      sql = ` update crediceara.users set dth_envio_edinheiro = now() where id in (${ids})`;
      // console.log(sql, ret);
      let r = database()
        .none(sql)
        .then((r) => r)
        .then((rr) => {
          console.log("atualizado...");
        })
        .catch((err) => {
          console.log(err, ids, sql);
          return {
            codeErro: 1,
            exception: err,
            point: "Atualizando",
            sql: sql,
          };
        });
      return {
        data_envio: new Date(),
        totalRegistros: ret.length,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
        sql: sql,
      };
    });
};

exports.postCadastros = function (params, headers) {
  let todos = params.date === "2021-01-01";
  // console.log("params", params);
  let sql = `select id as crediceara_id,
                      u.name as "nomeCidadao",
                      email as email,
                      cpf,
                      u.phone as "foneCelular",
                      email_verified_at as "emailVerificadoEm",
                      phone_verified_at as "foneVerificadoEm",
                      --status,
                      -- case when u.updated_at is not null and coalesce(mother_name, '') <> '' and u.status = 'Aguardando Confirmação' then 'Verificado' else u.status end as status, 
                      crediceara.fnc_verificastatus(id, mother_name , status) as status,
                      remember_token,
                      u.created_at,
                      u.updated_at,
                      birthday as "dataNascimento",
                      city_id as municipio_id,
                      mnc."name" as municipio,
                      emancipeted as emancipado,
                      social_name as "nomeSocial",
                      rg,
                      sexo,
                      address as endereco,
                      neighbor as bairro,
                      cep,
                      mother_name as "nomeMae",
                      marital_status as "stadoCivil",
                      is_cadunico as "temCadastroUnico",
                      occupation_id as ocupacao_id,
                      oc."name" as ocupacao,
                      total_income as renda_total_mensal,
                      declare_income_tax as declara_ir,
                      socials_beneficities as beneficios_sociais,
                      socials_programs as programa_sociais,
                      bank_account as conta_bancaria,
                      bank_code as codigo_banco,
                      study_level as escolaridade_id,
                      gi."name" as escolaridade,
                      have_halth_problems as possui_deficiencias,
                      is_family_boss as eh_chefe_familia,
                      is_victim_of_violence as eh_vitima_violencia,
                      have_company as tem_nogocio,
                      company_type as tipo_negocio_id,
                      ct."name" as tipo_empreendimento,                    
                      company_activite as atividade_negocio_id, act."name" as atividade_negocio,
                      number_employes as numero_colaboradores,
                      have_loan as tem_emprestimo,
                      company_of_loan as instituicao_emprestimo_id, col."name" as instituicao_emprestimo,
                      objetive_of_loan as objetivo_emprestimo_id,
                      oe."name" as objetivo_emprestimo, 
                      type_of_financing as tipo_financiamento_id,
                      tf."name" as tipo_financiamento,
                      need_training as precisa_treinamento,
                      have_internet as tem_acesso_internet,
                      have_computer as tem_computador,
                      own_email as email_proprio,
                      personal_references as referencias_pessoas,
                      total_scores as scores,
                      elegible as elegivel,
                      elegibity as elegiveis_por,
                      cnpj_mei,
                      how_will_be as como_sera_negocio,
                      dth_envio_edinheiro,
                      tpr.name as profile,
                      password
                    from crediceara.users u 
                        left join crediceara.domains mnc on u.city_id = mnc.domain_id
                        left join crediceara.domains act on u.company_activite = act.domain_id
                        left join crediceara.domains col on u.company_of_loan = col.domain_id
                        left join crediceara.domains ct on u.company_type = ct.domain_id
                        left join crediceara.domains oe on u.objetive_of_loan = oe.domain_id
                        left join crediceara.domains oc on u.occupation_id = oc.domain_id
                        left join crediceara.domains gi on u.study_level = gi.domain_id
                        left join crediceara.domains tf on u.type_of_financing = tf.domain_id
                        left join crediceara.domains tpr on u.profile_id = tpr.domain_id
                    where 0 = 0 `;

  if (!todos) {
    sql += ` u.created_at >= '${params.date}'::text::date and dth_envio_edinheiro is null `;
  }
  if (params.elegiveis !== "T") {
    if (params.elegiveis === "A")
      // sql += " and lower(tpr.name) like lower('Agente%') ";
      sql += " and lower(tpr.name) <> 'cidadão' ";
    else if (params.elegiveis === "S")
      sql += " and lower(tpr.name) = lower('Supervisor') ";
    else sql += ` and elegible = '${params.elegiveis}' `;
  }
  if (params.texto && params.texto !== "")
    sql += ` and (lower(crediceara.buscasemacento(u.name)) like crediceara.buscasemacento('%${params.texto}%')  
               or lower(crediceara.buscasemacento(mother_name)) like crediceara.buscasemacento('%${params.texto}%') 
               or lower(email) like '%${params.texto}%'
               or cpf like '%${params.texto}%'
               ) `;

  sql += " order by u.name ";
  if (!params.texto || params.texto === "") sql += "  limit 200";

  let dbinfo = {};
  // return retorno;
  // console.log(sql);
  return database()
    .manyOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      // console.log(sql);
      return {
        codeErro: 0,
        data_envio: new Date(),
        totalRegistros: ret.length,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
        sql: sql,
      };
    });
};

exports.getEdinheiroAgentes = function (headers) {
  let sql = ` select users.id, users.name, users.cpf, email
              from crediceara.users users
  	          join crediceara.domains d on users.profile_id = d.domain_id
  	          where lower(d."name") like lower('Agente%') order by users.name `;
  return database()
    .manyOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEdinheiroSupervidores = function (headers) {
  let sql = ` select users.id, users.name, users.cpf, email
              from crediceara.users users
  	          join crediceara.domains d on users.profile_id = d.domain_id
  	          where lower(d."name") like lower('Supervisor') order by users.name `;
  return database()
    .manyOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        lista: ret,
      };
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEdinheiroCadastrosQuery = async function (page, headers) {
  // let todos = params.date === "2021-01-01";
  console.log("getEdinheiroCadastrosQuery");
  let sql = " select count(*) as qtd from crediceara.vi_dados_edinheiro";
  let total = await database()
    .one(sql)
    .then((t) => {
      console.log("t", t);
      return t;
    })
    .catch((err) => console.log(err));

  sql = ` select * from crediceara.vi_dados_edinheiro 
           where (page = ${page} or page = 0) 
           order by created_at, page desc offset (${page}-1)*100 limit 100 `;

  return database()
    .manyOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      let ids = "";
      ret.forEach((element) => {
        // console.log('2. element', element);
        ids = ids + (ids === "" ? "" : ",") + element.id;
        element.page = page;
      });
      sql = ` update crediceara.users set dth_envio_edinheiro = now(), page = ${page} where id in (${ids}) `;
      // console.log(sql, ret);
      let r = database()
        .none(sql)
        // .then((r) => r)
        .then((rr) => {
          console.log("atualizado...");
        })
        .catch((err) => {
          console.log(err, ids, sql);
          return {
            codeErro: 1,
            exception: err,
            point: "Atualizando",
            sql: sql,
          };
        });
      return {
        data_envio: new Date(),
        length: ret.length,
        page: page,
        pages: parseInt(parseInt(total.qtd) / 100) + 1,
        lista: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql);
      return {
        codeErro: 1,
        exception: e,
        sql: sql,
      };
    });
};

exports.getEdinheiroCadastro = function (id, headers) {
  let sql = ` select * from crediceara.vi_dados_edinheiro where id = ${id}`;

  return database()
    .one(sql)
    .then((user) => {
      return {
        codeErro: 0,
        registro: user,
      };
    })
    .catch((err) => {
      console.log(err, sql);
      return {
        codeErro: 1,
        erro: err,
      };
    });
};
