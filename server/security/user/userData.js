const database = require("../../infra/database");
var AWS = require("aws-sdk");
// Set region
AWS.config.update({ region: "sa-east-1" });


exports.getUsuarios = function (headers) {
  let sql = `select id, 
                        "name" as "Nome", 
                        email as "eMail", 
                        cpf as "CPF", 
                        phone as "Celular", 
                        email_verified_at, 
                        phone_verified_at, 
                        "password" as "Password", 
                        status, 
                        remember_token, 
                        created_at, 
                        updated_at, 
                        birthday as  "DataNascimento", 
                        city_id as "MunicipioId", 
                        email_sended, 
                        sms_sended, 
                        emancipeted as "EhEmancioado",
                        scores as "Scores",
                        dth_envio_edinheiro as "DataEnvio",
                        elegible as"Elegivel"
                        from crediceara.users u
                        order by "nome"
    `;
  let dbinfo = {};
  return database()
    .manyOrNone(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        dbinfo: dbinfo,
        lista: ret,
      };
    })
    .catch((e) => console.log("erro ", e, sql));
};

exports.getUsuario = function (id, headers) {
  let sql = `select id, 
                     "name" as "Nome", 
                      email as "eMail", 
                      own_email as "EmailProprio", 
                      cpf as "CPF", 
                      phone as "Celular", 
                      email_verified_at, 
                      phone_verified_at, 
                      "password" as "Password", 
                      status, 
                      remember_token, 
                      created_at, 
                      updated_at, 
                      to_char(birthday,'dd/MM/yyyy') as  "DataNascimento", 
                      city_id as "MunicipioId", 
                      email_sended, 
                      sms_sended, 
                      emancipeted as "EhEmancioado",
                      social_name as "NomeSocial",
                      rg as "RG",
                      sexo as "Sexo",
                      address as "Endereco",
                      address_number as "EnderecoNumero",
                      address_complement as "EnderecoComplemento", 
                      neighbor as "Bairro",
                      cep as "CEP",
                      mother_name as "NomeMae",
                      marital_status as "EstadoCivil",
                      is_cadunico as "InscricaoCADUNICO",
                      occupation_id as "OcupacaoId",
                      total_income as "RendaBruta",
                      declare_income_tax as "DeclaraIR",
                      socials_beneficities as "BeneficiosSociais",
                      socials_programs as "ProgramasSociais",
                      bank_account as "ContaBancaria",
                      bank_code as "BancoCodigo",
                      study_level as "GrauInstrucao",
                      have_halth_problems as "TemDeficiancia",
                      is_family_boss as "ChefeFamilia",
                      is_victim_of_violence as "VitimaViolencia",
                      personal_references as "ReferenciasPessoais",
                      cnpj_mei as "CNPJMEI",
                      how_will_be as "ComoSera",
                      scores as "Scores",
                      owner_house as "CasaPropria",
                      have_dependent as "PossuiDependentes",
                      number_dependents as "QtdDependentes",
                      spouse_is_dependent as "ConjugeDependente",
                      others_dependent as "OutrosDenpendentes"
                      from crediceara.users u 
                    where id = ${id}
                    order by "name"`;
  let dbinfo = {};
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        dbinfo: dbinfo,
        registro: ret,
      };
    })
    .catch((e) => console.log("erro ", e, sql, id));
};

exports.putUsuario = function (id, reg, headers) {
  //console.log(reg);
  let sql = `  update crediceara.users
                      set name = crediceara.fnc_tonull('${reg.Nome}'), 
                      email = crediceara.fnc_tonull('${reg.eMail}'), 
                      own_email = crediceara.fnc_tonull('${reg.EmailProprio}'), 
                      cpf = crediceara.fnc_tonull('${reg.CPF}'), 
                      phone = crediceara.fnc_tonull('${reg.Celular}'),
                      password = crediceara.fnc_tonull('${reg.Password}'), 
                      birthday = crediceara.fnc_tonull('${reg.DataNascimento}')::text::date , 
                      city_id = ${reg.MunicipioId},
                      emancipeted = crediceara.fnc_tonull('${reg.EhEmancioado}'),
                      social_name = crediceara.fnc_tonull('${reg.NomeSocial}'),
                      rg = crediceara.fnc_tonull('${reg.RG}'),
                      sexo = crediceara.fnc_tonull('${reg.Sexo}'),
                      address = crediceara.fnc_tonull('${reg.Endereco}'),                      
                      address_number = crediceara.fnc_tonull('${reg.EnderecoNumero}'),
                      address_complement = crediceara.fnc_tonull('${reg.EnderecoComplemento}'), 
                      neighbor = crediceara.fnc_tonull('${reg.Bairro}'),
                      cep = crediceara.fnc_tonull('${reg.CEP}'),
                      mother_name = crediceara.fnc_tonull('${reg.NomeMae}'),
                      marital_status = crediceara.fnc_tonull('${reg.EstadoCivil}'),
                      is_cadunico = crediceara.fnc_tonull('${reg.InscricaoCADUNICO}'),
                      occupation_id = ${reg.OcupacaoId},
                      total_income = ${reg.RendaBruta},
                      declare_income_tax = crediceara.fnc_tonull('${reg.DeclaraIR}'),
                      socials_beneficities = crediceara.fnc_tonull('${reg.BeneficiosSociais}'),
                      socials_programs = crediceara.fnc_tonull('${reg.ProgramasSociais}'),
                      bank_account = crediceara.fnc_tonull('${reg.ContaBancaria}'),
                      bank_code = crediceara.fnc_tonull('${reg.BancoCodigo}'),
                      study_level = ${reg.GrauInstrucao},
                      have_halth_problems = crediceara.fnc_tonull('${reg.TemDeficiancia}'),
                      is_family_boss = crediceara.fnc_tonull('${reg.ChefeFamilia}'),
                      is_victim_of_violence = crediceara.fnc_tonull('${reg.VitimaViolencia}'),
                      have_company = crediceara.fnc_tonull('${reg.PossuiNegocio}'),
                      company_type = ${reg.FormaEmpreendimentoId},
                      company_activite = ${reg.AtividadeEmpreendimentoId},                      
                      number_employes = ${reg.QuantoEmpregados},
                      have_loan = crediceara.fnc_tonull('${reg.PossuiEmprestimo}'),
                      company_of_loan = ${reg.InstituicaoDoEmprestimoId},
                      objetive_of_loan = ${reg.ObjetivoEmprestimoId},
                      type_of_financing = ${reg.TipoFinanciamentoId},
                      need_training = crediceara.fnc_tonull('${reg.NecessitaCapacitacao}'),
                      have_internet = crediceara.fnc_tonull('${reg.AcessoInternet}'),
                      have_computer = crediceara.fnc_tonull('${reg.AcessoPorComputador}'),
                      personal_references = crediceara.fnc_tonull('${reg.ReferenciasPessoais}'), 
                      cnpj_mei = crediceara.fnc_tonull('${reg.CNPJMEI}'), 
                      how_will_be = crediceara.fnc_tonull('${reg.ComoSera}'),
                      scores = ${reg.Scores}, 
                      owner_house = ${reg.CasaPropria},
                      have_dependent = crediceara.fnc_tonull('${reg.PossuiDependentes}'),
                      number_dependents = ${reg.QtdDependentes},
                      spouse_is_dependent = crediceara.fnc_tonull('${reg.ConjugeDependente}'),
                      others_dependent = ${reg.OutrosDenpendentes},
                      elegible = crediceara.fnc_tonull('${reg.Elegivel}'),
                      egress_penal_system = crediceara.fnc_tonull('${reg.Egresso}'),
                      updated_at = now()
                    where id = ${id} returning *   `;
  // console.log(reg, sql);
  let dbinfo = {};
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        dbinfo: dbinfo,
        registro: ret,
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, reg, id);
      return {
        codeErro: 1,
        exception: e,
        // sql: sql
      };
    });
};

exports.deleteUsuario = function (id, headers) {
  let sql = ` delete from crediceara.users where id = ${id} `;
  return database()
    .none(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        message: "registro excluido com sucesso!",
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

exports.putUserverify = function (id, headers) {
  let sql = ` update crediceara.users set status = 'Verificado'   where id = ${id} and coalesce(mother_name, '') <> '' returning * `;
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        message: "Cidadão verificado com sucesso!",
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, id);
      return {
        codeErro: 1,
        exception: e,
        message: "O registro não pode ser verificado, nome da mãe ausente!",
      };
    });
};

exports.putCorrecaoDadosBasicos = function (id, body, headers) {
  let sql = ` update crediceara.users 
                  set name = upper('${body.Nome}'), 
                      cpf = '${body.cpf}', 
                      email = lower('${body.email}'), 
                      phone = '${body.celular}'
                      where id = '${id}' returning *`;

  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      return {
        codeErro: 0,
        message: "Cadastr atuazado com sucesso!",
      };
    })
    .catch((e) => {
      console.log("erro ", e, sql, id);
      return {
        codeErro: 1,
        exception: e,
        message: "O registro não pode ser atualizado!",
      };
    });
};

exports.getPerson = function (perfil, headers) {
  // if (perfil === "Agente") perfil = "Agente de Crédito";

  let sql = ` select id::integer, users.name as texto
              from crediceara.users users 
                join crediceara.domains d on users.profile_id = d.domain_id 
            where lower(d.name) like lower('${perfil}%')
            order by 2 `;

  //console.log("getPerson", sql);
  return database()
    .manyOrNone(sql)
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
        message: "Erro ao buscar " + perfil,
      };
    });
};

exports.postResetPasswordAdmin = function (body, headers) {
  let code = "#c12r3cr4d5@";
  // console.log("postResetPasswordAdmin", body);
  let sql = ` update crediceara.users
                   set  password = md5('${code}'), 
                   updated_at = now()
                   where cpf = '${body.cpf}' returning * `;

  
  return database()
    .one(sql)
    .then((r) => r)
    .then((ret) => {
      var params = {
        Destination: { ToAddresses: [body.email] },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `<p><b>Prezado Cidadão</b> </p><p>CearaCredi | Sua senha foi alterada para ${code}. Você poderá alterá-la antes mesmo de entrar no sistema clicando no botão [Trocar Senha]</p>`,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: "Alteração de senha pelo sistema",
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
          console.error(err, err.stack, body);
          return {
            codeErro: 1,
            exception: err.stack,
          };
        });
    })
    .catch((e) => {
      console.log(e, body);
      return {
        erroCode: 1,
        message: "Não foi possivel enviar o email",
      };
    });
};
