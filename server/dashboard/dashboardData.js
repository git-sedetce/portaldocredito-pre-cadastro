const database = require("../infra/database");

exports.getDashboardLogin = function (headers) {
  let sql = `select sum(case when created_at >= current_date then 1 else 0 end) as qtd_hoje,
                  sum(case when created_at >= (current_date-7) then 1 else 0 end) as qtd_7dias,
                sum(case when created_at >= (current_date-15) then 1 else 0 end) as qtd_15dias,
                sum(case when created_at >= (current_date-30) then 1 else 0 end) as qtd_30dias,
                sum(case when created_at >= (current_date-180) then 1 else 0 end) as qtd_6meses,
                sum(case when coalesce(mother_name, '') <> '' or status = 'Verificado' then 1 else 0 end) as qtd_verificados,
                count(*) as total,
                (select avg(qtd)
                from (
                select to_char(created_at, 'yyyy.MM.dd HH24') as dia, count(*) as qtd
                from crediceara.users 
                where created_at is not null 
                and created_at >= current_date - 2
                group by to_char(created_at, 'yyyy.MM.dd HH24')) g ) as media_hora
                from crediceara.users `;
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
        sql: sql,
      };
    });
};

exports.getDashboardHoje = function (id, headers) {
  let sql = ` select extract(HOUR from created_at) as hora,
              count(id)::int as qtd
            from crediceara.users 
            where created_at is not null
            and created_at >= (current_date-${id})
            group by extract(HOUR from created_at)
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
        sql: sql,
      };
    });
};

exports.getCargaBI = function (header) {
  let sql = ` select * from crediceara.users where created_at >= '2021-05-19'::text::date`;
  return database()
    .query(sql)
    .then((r) => r)
    .then((users) => {
      sql = ` select * from crediceara.domains `;
      return database()
        .query(sql)
        .then((r) => r)
        .then((domains) => {
          return {
            codeErro: 0,
            citizens: users,
            domains: domains,
          };
        })
        .catch((eUsers) => {});
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

exports.getPorRegional = async function (headers) {
  let sql = `select d2."name", count(*)::integer as y
              from crediceara.users u 
                join crediceara.domains d on u.city_id = d.domain_id 
                join crediceara.domains d2 on d.domain_fk  = d2.domain_id
                group by d2."name"
                order by 1`;
  let t1 = await database()
    .query(sql)
    .then((r) => r)
    .catch((e) => console.log("porregional1", e));
  sql = `select d2."name", count(*)::integer as y
              from crediceara.users u 
                join crediceara.domains d on u.city_id = d.domain_id 
                join crediceara.domains d2 on d.domain_fk  = d2.domain_id
                where u.elegible = 'S'
                  and u.have_company = 'N'
                  and u.have_loan = 'N'
                group by d2."name"
                order by 1`;
  let t2 = await database()
    .query(sql)
    .then((r) => r)
    .catch((e) => console.log("porregional2", e));

  return {
    codeErro: 0,
    todos: t1,
    verificados: t2
  };
};

exports.getMediaHoraria = function (header) {
  let sql = `select extract(year from created_at) as ano,
                    to_char(extract(month from created_at), '00') as mes,
                    to_char(extract(day from created_at), '00') as dia,
                    to_char(extract(hour from created_at), '00') as hora,
                    count(*) as total,
                    sum(case when status = 'Verificado' then 1 else 0 end) as verificado,
                    sum(case when status <> 'Verificado' then 1 else 0 end) as nao_verificado,
                    sum(case when elegible = 'S' then 1 else 0 end) as elegivel,
                    sum(case when elegible <> 'S' then 1 else 0 end) as nao_elegivel,
                    sum(case when city_id = 242 then 1 else 0 end) as capital,
                    sum(case when city_id = 242 then 0 else 1 end) as interior
                  from crediceara.users 
                  where created_at is not null and created_at > '2021-05-19'::text::date
                  group by extract(year from created_at),
                  to_char(extract(month from created_at), '00'),
                  to_char(extract(day from created_at), '00'),
                  to_char(extract(hour from created_at), '00') 
                    order by 1 desc,2 desc, 3 desc, 4 desc`;

  return database()
    .query(sql)
    .then((r) => r)
    .then((medias) => {
      return {
        codeErro: 0,
        message: "Comando executado com sucesso!",
        lista: medias,
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

exports.getCargaBIReduzida = async function (header) {
  let lista = [];
  let listap = [];
  let step = 200;
  let index = -1;
  let faca = true;

  while (faca) {
    index++;
    let sql = ` SELECT id, name, created_at, birthday, city_id, emancipeted, sexo, cep, marital_status, is_cadunico, 
                      occupation_id, total_income, declare_income_tax, socials_beneficities, socials_programs,  
                      study_level, is_family_boss, is_victim_of_violence, have_company, company_type, company_activite, 
                      number_employes, have_loan, company_of_loan, objetive_of_loan, type_of_financing, need_training,     
                      total_scores, elegible, elegibity, how_will_be, scores, dth_envio_edinheiro, dth_retorno_edinheiro,  
                      have_dependent, number_dependents, spouse_is_dependent
                FROM crediceara.users
                where created_at >= '2021-05-19'::text::date 
                order by created_at offset (${step}*${index}) limit ${step} `;
    listap = await database()
      .query(sql)
      .then((r) => r)
      .then((ret) => {
        // console.log(sql);
        return {
          codeErro: 0,
          lista: ret,
        };
      })
      .catch((e) => {
        console.log("index", index, "position ", index * step, sql, e);
        return {
          codeErro: 1,
        };
      });

    // faca = false;
    if (listap.codeErro === 0) {
      lista = lista.concat(listap.lista);
    }
    console.log("index", index, "position ", index * step, listap.lista.length);
    if (listap.lista.length < step) faca = false;
  }
  return {
    codeErro: 0,
    index: index,
    tamanho: lista.length,
    step: step,
    lista: lista,
  };
};

exports.getBigChart = function (headers) {
  let sql = ` select d2."name" as regiao, to_char(u.created_at, 'yyyy.MM.dd') as dth,  count(*)::integer as qtd
                from crediceara.users u 
                  join crediceara.domains d on u.city_id = d.domain_id 
                  join crediceara.domains d2 on d.domain_fk  = d2.domain_id
                  where u.created_at > '2021-05-19'::text::date
                    and u.created_at >= (current_date -7)
                  group by d2."name", to_char(u.created_at, 'yyyy.MM.dd')
                  order by 1, 2 `;
  return database()
    .query(sql)
    .then((r) => r)
    .then((medias) => {
      let regioes = [];
      let regs = "";
      var reg = {};
      medias.forEach((item) => {
        if (regs !== item.regiao) {
          reg = { name: item.regiao, data: [] };
          if (regs !== "") {
            regioes.push(reg);
          }
          regs = item.regiao;
        }
        reg.data.push(item.qtd);
      });
      // console.log("bigchart", regioes);
      return {
        codeErro: 0,
        message: "Comando executado com sucesso!",
        lista: regioes,
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

exports.getPorRegionalDetalhes = function (headers) {
  let sql = `select d2.name as regiao,
                    count(*) as total,
                    sum(case when status = 'Verificado' then 1 else 0 end) as verificado,
                    sum(case when status <> 'Verificado' then 1 else 0 end) as nao_verificado,
                    sum(case when elegible = 'S' then 1 else 0 end) as elegivel,
                    sum(case when elegible <> 'S' then 1 else 0 end) as nao_elegivel,
                    sum(case when city_id = 242 then 1 else 0 end) as capital,
                    sum(case when city_id = 242 then 0 else 1 end) as interior
                  from crediceara.users u
                      join crediceara.domains d on  u.city_id = d.domain_id
                      join crediceara.domains d2 on d.domain_fk  = d2.domain_id
                  where u.created_at is not null and u.created_at > '2021-05-19'::text::date
                  group by d2.name 
                    order by 2 desc `;

  return database()
    .query(sql)
    .then((r) => r)
    .then((medias) => {
      return {
        codeErro: 0,
        message: "Comando executado com sucesso!",
        lista: medias,
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
