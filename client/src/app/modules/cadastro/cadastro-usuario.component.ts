import { Component, OnInit } from "@angular/core";
import {
  ThemePalette,
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { ExternalService } from "src/app/shared/services/external.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { loggar } from "src/app/shared/services/constantes";
import { Cadastro } from "src/app/models/models";
import { CadastroService } from "./cadastro.service";

@Component({
  selector: "app-cadastro-usuario",
  templateUrl: "./cadastro-usuario.component.html",
  styleUrls: ["./cadastro-usuario.component.scss"],
})
export class CadastroUserComponent implements OnInit {
  formGroup: FormGroup;
  color: ThemePalette = 'accent';
  cidades: any[];
  registro: Cadastro;
  id: any;
  contaPesos: string[];
  // isCADUNICO: boolean;
  ocupacoes: any[];
  // declaraIR: boolean;
  instrucoes: any[];
  // temDeficiencia: boolean;
  // chefeFamilia: boolean;
  // vitimaViolencia: boolean;
  possuiNegocio: boolean;
  formasEmpreendimentos: any[];
  atividadesEmpreendimentos: any[];
  instituicoes: any[];
  objetivosCredito: any[];
  tiposFinanciamentos: any[];
  tipoResidencia: any[];
  necessitaCapacitacao: boolean;
  temas: any[];
  AondeSera: any[];
  acessoInternet: boolean;
  acessoPorComputador: boolean;
  possuiEmprestimo: boolean;
  emancipado: boolean;
  idade: number;
  // egresso: boolean;
  showOther: boolean;
  programasSociais: any[];
  estadoCivil: any[];
  quantasPessoas: any[];
  qtdFuncionarios: any[];
  emailProprio: boolean;
  situacaoCelular: any[];
  beneficiosSociais: any[];
  elegivel: boolean;
  criterios: string;
  ehMEI: boolean;

  pagina: number;

  erroMsg: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fp: FormBuilder,
    public service: ExternalService,
    private myService: CadastroService
  ) {
    document.title = "Cadastro - CrediCeara";
    this.id = route.snapshot.params.id;
    this.formasEmpreendimentos = [];
    this.atividadesEmpreendimentos = [];
    this.instituicoes = [];
    this.objetivosCredito = [];
    this.tiposFinanciamentos = [];
    this.temas = [];
    this.idade = 0;
    this.showOther = false;
    this.programasSociais = [];
    this.estadoCivil = [];
    this.beneficiosSociais = [];
    this.situacaoCelular = [];
    this.pagina = 1;

    this.erroMsg = [];

    if (loggar) console.log("parametro", this.id);

    this.registro = new Cadastro(0);
    this.createForm();
  }

  private getValueMsg(valor: any, field: string, msg: string) {
    this.erroMsg.push({ key: field, value: msg });
    // if (loggar) console.log('get ValueMsg', this.erroMsg);
    return valor;
  }

  calculaPesos(form: FormGroup): number {
    let soma = 0;
    this.criterios = '';
    this.elegivel = false;

    this.contaPesos = ['TemDeficiancia', 'Sexo', 'ChefeFamilia', 'VitimaViolencia'];

    /// Verifica a elegibilidade quanto a idade
    if (this.idade < 18 && !this.emancipado) this.elegivel = false;
    else if (this.idade < 29) { soma = soma + 3; this.criterios = 'Idade(<29)+3;'; }
    else if (this.idade < 60) { soma = soma + 2; this.criterios = 'Idade(<60)+2;'; }
    else { soma++; this.criterios = 'Idade(>29)+1;'; }

    /// Verifica a elegibilidade quanto a renda
    if (this.formGroup.controls['DeclaraIR'].value !== 'S' || this.formGroup.controls['RendaBruta'].value <= 3300 ||
      (this.formGroup.controls['OcupacaoId'].value === 4 && this.formGroup.controls['RendaBruta'].value <= 6750)) {
      this.elegivel = true;
      this.criterios += 'Nao IR ou Renda Compatível;';
    }

    this.programasSociais.forEach(prog => {
      // if (loggar) console.log('prog', prog);
      if (prog.flg) {
        soma += 3;
        this.criterios += prog.texto + ' +' + prog.valor + '; ';
        if (loggar) console.log('criterios', this.criterios, soma);
      } else soma++;
    });

    if (this.formGroup.controls['TemDeficiancia'].value === 'S') { soma += 3; this.criterios += 'Com Deficiência +3; '; }

    if (this.formGroup.controls['ChefeFamilia'].value === 'S') { soma += 3; this.criterios += 'É chefe de família +3; '; }

    if (this.formGroup.controls['VitimaViolencia'].value === 'S') { soma += 3; this.criterios += 'Foi vítima de violência +3; '; }

    if (loggar && this.elegivel) console.log('criterios', 'elegível por ', this.criterios, soma);

    return soma;
  }


  createForm() {
    this.formGroup = this._fp.group({
      Nome: new FormControl(this.getValueMsg(this.registro.Nome, 'Nome', 'Nome:* O nome é obrigatório e não deve ter abreviações ou conforme documentos'), [Validators.required]),
      DataNascimento: new FormControl(this.getValueMsg(this.registro.DataNascimento, 'DataNascimento', 'Data Nascimento:*  A data de nascimento é obrigatório'), [Validators.required,]),
      CPF: new FormControl(this.getValueMsg(this.registro.CPF, 'CPF', 'CPF:* O é obrigatório'), [Validators.required]),
      MunicipioId: new FormControl(this.getValueMsg(this.registro.MunicipioId, 'MunicipioId', 'Município:*  O município é obrigatório de deve ser somente do Ceará'), [Validators.required,]),
      Celular: new FormControl(this.getValueMsg(this.registro.Celular, 'Celular', 'Celular:*  O número do celular é obrigatório, pois será utilizado para entrar em contato com o cidadão caso seja elegível'), [Validators.required]),
      Status: new FormControl('Cidadão'),
      eMail: new FormControl(this.getValueMsg(this.registro.eMail, 'eMail', 'e-mail:*  O e-mail é obrigatório.'), [Validators.required]),
      ComoSeraId: new FormControl(this.registro.ComoSeraId),
      NomeSocial: new FormControl(this.registro.NomeSocial),
      RG: new FormControl(this.getValueMsg(this.registro.RG, 'RG', 'RG:*  O RG é obrigatório e deve ser válido'), [Validators.required]),
      Sexo: new FormControl(this.getValueMsg(this.registro.Sexo, 'Sexo', 'Sexo:*  O sexo é obrigatório'), [Validators.required]),
      Endereco: new FormControl(this.getValueMsg(this.registro.Endereco, 'Endereco', 'Endereço:*  O endereço é obrigatório para posterior correspondências'), [Validators.required]),
      EnderecoNumero: new FormControl(this.getValueMsg(this.registro.EnderecoNumero, 'EnderecoNumero', 'Número:*  O número no endereço é obrigatório para posterior correspondências'), [Validators.required]),
      EnderecoComplemento: new FormControl(this.getValueMsg(this.registro.EnderecoNumero, 'EnderecoNumero', 'Número:*  O número no endereço é obrigatório para posterior correspondências')),
      Bairro: new FormControl(this.getValueMsg(this.registro.Bairro, 'Bairro', 'Bairro:*  O bairro é obrigatório para posterior correspondências'), [Validators.required]),
      CEP: new FormControl(this.getValueMsg(this.registro.CEP, 'CEP', 'CEP:*  O CEP é obrigatório para posterior correspondências'), [Validators.required]),
      NomeMae: new FormControl(this.getValueMsg(this.registro.NomeMae, 'NomeMae', 'Nome da Mãe:*  O nome da mãe é obrigatório para verificação daos documentos'), [Validators.required]),
      EstadoCivil: new FormControl(this.getValueMsg(this.registro.EstadoCivil, 'EstadoCivil', 'Estado Cívil:*  O estado cívil é obrigatório')),
      InscricaoCADUNICO: new FormControl(this.registro.InscricaoCADUNICO),
      OcupacaoId: new FormControl(this.getValueMsg(this.registro.OcupacaoId, 'OcupacaoId', 'Ocupação do Cidadão:*  A ocupação atual do cidadão é obrigatória')),
      RendaBruta: new FormControl(this.registro.RendaBruta),
      DeclaraIR: new FormControl(this.registro.DeclaraIR),
      BeneficiosSociais: new FormControl(this.registro.BeneficiosSociais),
      ProgramasSociais: new FormControl(this.registro.ProgramasSociais),
      ContaBancaria: new FormControl(this.registro.ContaBancaria),
      GrauInstrucao: new FormControl(this.getValueMsg(this.registro.GrauInstrucao, 'GrauInstrucao', 'Grau de Instrução:*  O grau de instrução é obrigatório')),
      TemDeficiancia: new FormControl(this.registro.TemDeficiancia),
      ChefeFamilia: new FormControl(this.registro.ChefeFamilia),
      VitimaViolencia: new FormControl(this.registro.VitimaViolencia),
      PossuiNegocio: new FormControl(this.registro.PossuiNegocio),
      FormaEmpreendimentoId: new FormControl(this.registro.FormaEmpreendimentoId),
      AtividadeEmpreendimentoId: new FormControl(this.registro.AtividadeEmpreendimentoId),
      QuantoEmpregados: new FormControl(this.registro.QuantoEmpregados),
      OndeENegocio: new FormControl(this.registro.OndeENegocio),
      InstituicaoDoEmprestimoId: new FormControl(this.registro.InstituicaoDoEmprestimoId),
      ObjetivoEmprestimoId: new FormControl(this.registro.ObjetivoEmprestimoId),
      TipoFinanciamentoId: new FormControl(this.registro.TipoFinanciamentoId),
      NecessitaCapacitacao: new FormControl(this.registro.NecessitaCapacitacao),
      TemasDeInteresse: new FormControl(this.registro.TemasDeInteresse),
      AcessoInternet: new FormControl(this.registro.AcessoInternet),
      AcessoPorComputador: new FormControl(this.registro.AcessoPorComputador),
      PossuiEmprestimo: new FormControl(this.registro.PossuiEmprestimo),
      Emancipado: new FormControl(this.registro.Emancipado),
      Egresso: new FormControl(this.registro.Egresso),
      ComoSera: new FormControl(this.registro.ComoSera),
      InstituicaoOutra: new FormControl(this.registro.InstituicaoOutra),
      EmailProprio: new FormControl(this.registro.EmailProprio),
      CelularProprioId: new FormControl(this.getValueMsg(this.registro.CelularProprioId, 'CelularProprioId', 'Celular próprio:*  O cidadão deverá informar se o celular informado é próprio ou não')),
      ReferenciasPessoais: new FormControl(this.registro.ReferenciasPessoais),
      NadaCosta: new FormControl(this.registro.NadaCosta),
      CNPJMEI: new FormControl(this.registro.CNPJMEI),
      Scores: new FormControl(this.registro.Scores),
      CasaPropria: new FormControl(this.registro.CasaPropria),
      PossuiDependentes: new FormControl(this.registro.PossuiDependentes),
      QtdDependentes: new FormControl(this.registro.QtdDependentes),
      ConjugeDependente: new FormControl(this.registro.ConjugeDependente),
      OutrosDenpendentes: new FormControl(this.registro.OutrosDenpendentes),
      PossuiContaBancaria: new FormControl(this.registro.PossuiContaBancaria),
      owner_house: new FormControl(this.registro.TipoResidenciaId),
      Idade: new FormControl(0),
      PaginaUnica: new FormControl(false)
    });

    this.possuiNegocio = this.formGroup.controls["PossuiNegocio"].value === "S";
    this.necessitaCapacitacao = this.formGroup.controls["NecessitaCapacitacao"].value === "S";
    this.acessoInternet = this.formGroup.controls["AcessoInternet"].value === "S";
    this.acessoPorComputador = this.formGroup.controls["AcessoPorComputador"].value === "S";
    this.possuiEmprestimo = this.formGroup.controls["PossuiEmprestimo"].value === "S";
    // this.egresso = this.formGroup.controls["Egresso"].value === "S";
    this.emailProprio = this.formGroup.controls["EmailProprio"].value === "S";

    try {
      this.idade = this.service.getAge(this.service.StringToDate(this.registro.DataNascimento));
      this.emancipado = this.formGroup.controls["Emancipado"].value === "S" || this.idade >= 18;
    } catch (error) { }

    //if (this.possuiNegocio) {
    this.service.httpGet("domains/AtividadeNegocio")
      .subscribe((res) => { this.atividadesEmpreendimentos = res.lista; }, (erro) => console.log(erro));
    // } else {
    this.service.httpGet("domains/FormaNegocio")
      .subscribe((res) => { this.formasEmpreendimentos = res.lista; }, (erro) => console.log(erro));
    //}

    this.restoreProgramas(this.registro.ProgramasSociais);
    this.restoreBeneficios(this.registro.BeneficiosSociais);

  }
  restoreBeneficios(BeneficiosSociais: string) { this.beneficiosSociais.forEach(element => { element.flg = (BeneficiosSociais + "").indexOf(element.texto) >= 0; }); }

  restoreProgramas(ProgramasSociais: string) { this.programasSociais.forEach(element => { element.flg = (ProgramasSociais + "").indexOf(element.texto) >= 0; }); }

  consultarSSP() {
    this.prepareToSave(this.formGroup.value);

    if (this.registro.Nome !== '' && this.registro.NomeMae !== '' && this.registro.DataNascimento !== null && this.registro.RG !== '') {
      this.myService.consultarSSP(this.registro.Nome, this.registro.NomeMae, this.formGroup.controls['DataNascimento'].value, this.registro.RG)
        .subscribe(r => {
          if (loggar) console.log('retorno ssp', r);
          this.formGroup.controls["NadaCosta"].setValue(r);
        }, erro => console.log(erro));
    }
  }

  consultarJUCEC() {
    this.myService.consultarJUCEC()
      .subscribe(r => {
        console.log('retorno token jucec', r);
      });
  }

  consultaCEP(cep: any) {
    if (loggar) console.log('cep', cep);
    this.service.httpClient.get(`https://viacep.com.br/ws/${cep}/json/`)
      .subscribe((r: any) => {
        if (loggar) console.log('retorno', r);
        this.formGroup.controls['Endereco'].setValue(r.logradouro);
        this.formGroup.controls['Bairro'].setValue(r.bairro);
        let mun = this.cidades.find(x => x.texto.toLowerCase() === r.localidade.toLowerCase());
        this.formGroup.controls['MunicipioId'].setValue(mun.id);
        this.service.httpPost('consultacep', r)
          .subscribe(data => {
            if (loggar) console.log('cep cadastro', data);
          }, error => console.log(error));

      }, erro => console.log(erro));
  }

  ngOnInit() {
    //this.router.navigate(['fdif']);
    this.service.httpGet("domains/Ocupacao").subscribe((res) => {
      this.ocupacoes = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/GrauInstrucao").subscribe((res) => {
      this.instrucoes = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/InstituicaoFinanceira").subscribe((res) => {
      this.instituicoes = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/ObjetivoCredito").subscribe((res) => {
      this.objetivosCredito = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/TipoFinanciamento").subscribe((res) => {
      this.tiposFinanciamentos = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/ProgramaSocial").subscribe((res) => {
      this.programasSociais = res.lista; if (loggar) console.log('programa', this.programasSociais)
    }, (erro) => console.log(erro));
    // this.service.httpGet("domains/BeneficioSocial").subscribe((res) => { this.beneficiosSociais = res.lista; }, (erro) => console.log(erro));
    this.service.httpGet("domains/EstadoCivil").subscribe((res) => {
      this.estadoCivil = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/AondeSera").subscribe((res) => {
      this.AondeSera = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/TemaCapacitacao").subscribe((res) => {
      this.temas = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/Municipio").subscribe((res) => {
      this.cidades = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/QtdColaboradores").subscribe((res) => {
      this.qtdFuncionarios = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/SituacaoCelular").subscribe((res) => {
      this.situacaoCelular = res.lista;
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/TipoResidencia").subscribe((res) => {
      this.tipoResidencia = res.lista;
    }, (erro) => console.log(erro));

    if (this.id) {
      this.service.httpGet("user/" + this.id).subscribe(
        (rest) => {
          if (loggar) console.log("rest", rest);
          this.registro = rest.registro;
          //this.service.Perfil = this.registro.Status;
          this.createForm();
          // this.consultarSSP();
          // this.consultarJUCEC();
          this.registro.Scores = this.calculaPesos(this.formGroup);
        },
        (erro) => console.log(erro)
      );
    }
  }


  // tgChange(event: any) { this.isCADUNICO = event; this.formGroup.controls["InscricaoCADUNICO"].setValue(this.isCADUNICO ? "S" : "N"); }

  // tgDeclaraIR(event: any) { this.declaraIR = event; this.formGroup.controls["DeclaraIR"].setValue(this.declaraIR ? "S" : "N"); }

  // tgtemDeficiencia(event: any) { this.temDeficiencia = event; this.formGroup.controls["TemDeficiencia"].setValue(this.temDeficiencia ? "S" : "N"); }

  // tgchefeFamilia(event: any) { this.chefeFamilia = event; this.formGroup.controls["ChefeFamilia"].setValue(this.chefeFamilia ? "S" : "N"); }

  // tgvitimaViolencia(event: any) { this.vitimaViolencia = event; this.formGroup.controls["VitimaViolencia"].setValue(this.vitimaViolencia ? "S" : "N"); }

  tgPossuiNegocio(event: any) {
    this.possuiNegocio = event;
    this.formGroup.controls["PossuiNegocio"].setValue(this.possuiNegocio ? "S" : "N");

    if (this.possuiNegocio) {
      this.service.httpGet("domains/AtividadeNegocio")
        .subscribe((res) => { this.atividadesEmpreendimentos = res.lista; }, (erro) => console.log(erro));
    } else {
      this.service.httpGet("domains/FormaNegocio")
        .subscribe((res) => { this.atividadesEmpreendimentos = res.lista; }, (erro) => console.log(erro));
    }
  }

  selecionadoInstituicao(event: any) {

    let item = this.instituicoes.find(x => x.id === event);
    this.showOther = item.domain_flg === 'S';
    // console.log('selectedIntituicao', event, item, this.instituicoes);
  }

  selecaoOcupacao(event: any) {
    let item = this.ocupacoes.find(x => x.id === event);
    if (loggar) console.log('selecaoOcupacao', event, item);
    this.ehMEI = item.domain_flg === 'S';
  }

  tgnecessitaCapacitacao(event: any) {
    this.necessitaCapacitacao = event;
    this.formGroup.controls["NecessitaCapacitacao"].setValue(this.necessitaCapacitacao ? "S" : "N");
  }
  tgacessoInternet(event: any) {
    this.acessoInternet = event;
    this.formGroup.controls["AcessoInternet"].setValue(this.acessoInternet ? "S" : "N");
  }

  tgacessoPorComputador(event: any) { this.acessoPorComputador = event; this.formGroup.controls["AcessoPorComputador"].setValue(this.acessoPorComputador ? "S" : "N"); }

  tgPossuiEmprestimo(event: any) { this.possuiEmprestimo = event; this.formGroup.controls["PossuiEmprestimo"].setValue(this.possuiEmprestimo ? "S" : "N"); }

  tgEmancipado(event: any) { this.emancipado = event; this.formGroup.controls["Emancipado"].setValue(this.emancipado ? "S" : "N"); }

  // tgegresso(event: any) { this.egresso = event; this.formGroup.controls["Emancipado"].setValue(this.egresso ? "S" : "N"); }

  tgemailProprio(event: any) { this.emailProprio = event; this.formGroup.controls["EmailProprio"].setValue(this.emailProprio ? "S" : "N"); }

  tgOnOff(event: any, target: boolean, formControl: string) {
    target = event;
    this.formGroup.controls[formControl].setValue(target ? "S" : "N");
  }

  selectedIntituicao(event: any) {
    console.log('selectedIntituicao', event);
  }

  calculaIdade() {
    let dataN = this.service.StringToDate(this.formGroup.controls['DataNascimento'].value);
    this.idade = this.service.getAge(dataN);
    this.formGroup.controls['Idade'].setValue(this.idade);
    this.emancipado = (this.idade >= 18);
    console.log('Data Nascimento', dataN, this.idade);
  }

  checkChange(event: any, item: any): void {
    item.flg = event.checked;
    console.log('chackChange', event, item, this.programasSociais);
    console.log('getProgramas', this.getProgramas());
  }
  onNoClick() {
    console.log("onNoClick", this.formGroup.value);
    //this.prepareToSave(this.formGroup.value);
    this.save(this.formGroup.value, this.pagina);
  }

  private prepareToSave(formModel: Cadastro): void {
    this.registro = { ...this.registro, ...formModel };
    this.registro.DataNascimento = this.service.StringToDate(
      formModel.DataNascimento
    );
    this.registro.CPF = formModel.CPF.replace(".", "")
      .replace(".", "")
      .replace("-", "");
    this.registro.Celular = formModel.Celular.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
    console.log(this.registro);
    this.registro.Scores = this.calculaPesos(this.formGroup);
    this.registro.Elegivel = this.elegivel ? 'S' : 'N';
    this.service.Elegivel = this.elegivel;
    // tinha loggar aqui
  }

  public helper(texto: string) { this.service.helper = texto; }

  voltar(page: number) {
    this.pagina--;
    // this.save(this.formGroup.value);
  }

  save(formGroup: Cadastro, pageNumber: number) {
    formGroup.BeneficiosSociais = this.getBeneficios();
    formGroup.ProgramasSociais = this.getProgramas();
    const erros = this.service.findInvalidControls(this.formGroup, this.erroMsg);

    if (erros.length === 0) {
      this.prepareToSave(formGroup);

      if (loggar) console.log('save registro', this.registro);
      this.service
        .save(this.registro.id, "user", this.registro)
        .subscribe((ret) => {
          if (loggar) console.log('user', ret);
          if (ret.codeErro > 0) {
            console.log('erro', ret);
            this.router.navigate(['pos-cadastro']);
            this.service.snackBar.open(
              'Algo deu errado., já estamos providenciando a solução',
              "Ops!",
              {
                duration: 5000
              }
            );
          } else {
            this.pagina = pageNumber;
            this.id = ret.registro.id;
            if (this.pagina > 3 || this.formGroup.value.PaginaUnica) {
              if (this.service.Perfil !== 'Cidadão')
                this.router.navigate(["/cadastros", 'T']);
              else
                this.router.navigate(['pos-cadastro']);
              if (this.id) {
                this.service.httpGet("user/" + this.id).subscribe(
                  (rest) => {
                    if (loggar) console.log("rest", rest);
                    this.registro = rest.registro;
                    this.createForm();
                    this.service.snackBar.open(
                      'Registro gravado com sucesso!',
                      "Show",
                      { duration: 5000 }
                    );
                  },
                  (erro) => console.log(erro)
                );
              }
            }
          }
          console.log("save", ret, this.pagina);
        });
    }
  }

  getProgramas(): string {
    let lista = '';
    this.programasSociais.forEach(element => {
      if (element.flg) {
        lista = lista + (lista === '' ? '' : ',') + element.texto;
      }
    });
    return lista;
  }

  getBeneficios(): string {
    let lista = '';
    this.beneficiosSociais.forEach(element => {
      if (element.flg) {
        lista = lista + (lista === '' ? '' : ',') + element.texto;
      }
    });
    return lista;
  }

  PrintElem(elem) {
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title + '</h1>');
    mywindow.document.write(elem.innerHTML);
    // mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  }



}
