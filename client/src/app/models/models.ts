export class PreCadastro {
  DataNascimento: any;
  Nome: string;
  Celular: string;
  MunicipioId: any;
  eMail: any;
  constructor(public id: number, public CPF: string = "") {
    this.Nome = "";
    this.DataNascimento = null;
    this.Celular = null;
  }
}

export class Cadastro {

  constructor(
    public id: number,
    public CPF: string = null,
    public DataNascimento: Date = null,
    public Nome: string = null,
    public Celular: string = null,
    public MunicipioId: number = null,
    public eMail: string = null,
    public NomeSocial: string = null,
    public RG: string = null,
    public Sexo: string = null,
    public Endereco: string = null,
    public Bairro: string = null,
    public CEP: string = null,
    public NomeMae: string = null,
    public EstadoCivil: string = null,
    public InscricaoCADUNICO: string = 'N',
    public OcupacaoId: number = null,
    public RendaBruta: number = 0,
    public DeclaraIR: string = 'N',
    public BeneficiosSociais: string = null,
    public ProgramasSociais: string = null,
    public ContaBancaria: string = null,
    public GrauInstrucao: string = null,
    public TemDeficiancia: string = 'N',
    public ChefeFamilia: string = 'N',
    public VitimaViolencia: string = 'N',
    public PossuiNegocio: string = 'N',
    public FormaEmpreendimentoId: number = null,
    public AtividadeEmpreendimentoId: number = null,
    public QuantoEmpregados: number = null,
    public OndeENegocio: number = null,
    public InstituicaoDoEmprestimoId: number = null,
    public ObjetivoEmprestimoId: number = null,
    public TipoFinanciamentoId: number = null,
    public NecessitaCapacitacao: string = 'N',
    public TemasDeInteresse: string = null,
    public AcessoInternet: string = 'N',
    public AcessoPorComputador: string = 'N',
    public PossuiEmprestimo: string = 'N',
    public Emancipado: string = 'S',
    public Egresso: string = "S",
    public ComoSeraId: number = null,
    public ComoSera: string = null,
    public InstituicaoOutra: string = null,
    public EmailProprio: string = 'S',
    public CelularProprioId: number = null,
    public ReferenciasPessoais: string = null,
    public NadaCosta: string = '',
    public CNPJMEI: string = null,
    public Scores: number = null,
    public Status: string = null,
    public CasaPropria: string = null,
    public PossuiDependentes: string = null,
    public QtdDependentes: number = null,
    public ConjugeDependente: string = null,
    public OutrosDenpendentes: string = null,
    public Elegivel: string = 'N',
    public EnderecoNumero: string = '',
    public EnderecoComplemento: string = '',
    public PossuiContaBancaria: string = '',
    public TipoResidenciaId: number = null,) {

  }
}

export class Domain {
  constructor(
    public id: number,
    public code: string = '',
    public name: string = '',
    public domain_type: string = '') {

  }
}

export class Jurisdicao {


  constructor(
    public id: number,
    public Nome: string = null, 
    public PostoId: number = null,
    public SupervisorId: number = null,
    public RegiaoId: number = null, 
    public SedeId: number = null) {

  }
}