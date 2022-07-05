import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';
import { CorrecaoDadosBasicosComponent } from '../correcao-dados-basicos/correcao-dados-basicos.component';
import { AtrbuirAgenteComponent } from '../dialogs-popup/atrbuir-agente/atrbuir-agente.component';

@Component({
  selector: 'app-minha-jurisdicao',
  templateUrl: './minha-jurisdicao.component.html',
  styleUrls: ['./minha-jurisdicao.component.scss']
})
export class MinhaJurisdicaoComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns = [
    "id",
    "regional",
    // "sede", 
    // "posto", 
    "cpf",
    "nomeCidadao",
    // "foneCelular",
    "email",
    "agente",
    "sexo",
    // "status",
    // "scores",
    // "enviado",
    "renda",
    "datacadastro",
    // "profile",
    "Acao"
  ];
  dataSource;
  registros: any[];
  elegiveis: any;
  admin: boolean;
  textoBusca: string;
  agentes: any[];
  lastAgenteId: any;
  formGroup: FormGroup;
  haveCompany = false;
  haveLoan = false;
  enviados = false;
  locais: any[];

  constructor(
    public service: ExternalService,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private router: Router) {
    if (this.route.snapshot.params.id)
      this.elegiveis = this.route.snapshot.params.id;
    else
      this.elegiveis = 'T';
    this.lastAgenteId = this.service.UserId;
    this.formGroup = this._fb.group({
      haveCompany: new FormControl(false),
      haveLoan: new FormControl(false),
      enviados: new FormControl(false)
    });
    console.log('formGroup', this.formGroup);
  }

  agenteSelecionado(id: any) {
    this.lastAgenteId = id;
    this.listar(this.lastAgenteId);
  }

  ngOnInit(): void {
    this.lastAgenteId = this.service.UserId;

    this.service.httpGet('people/Agente')
      .subscribe(r => {
        this.agentes = r.lista;
        if (loggar) console.log('agentes', this.agentes);
      }, error => console.log(error));
    this.listar(this.lastAgenteId);
    this.admin = (this.service.Perfil.toLowerCase() === 'admin');
  }

  search() {
    this.listar(this.lastAgenteId);
  }

  /*noCompanyClick() {
    this.haveCompany = !this.haveCompany;
    this.listar(this.lastAgenteId);
  }

  enviadosClick() {

    this.enviados = !this.enviados;
    this.listar(this.lastAgenteId);
  }

  noLoanClick() {
    this.haveLoan = !this.haveLoan;
    this.listar(this.lastAgenteId);
  }*/

  listar(id: any = null) {
    let localId = this.service.UserId;
    if (id !== null)
      localId = id;
    let capsula = {
      id: localId,
      haveBussiness: this.formGroup.value.haveCompany,
      haveLoan: this.formGroup.value.haveLoan,
      enviados: this.formGroup.value.enviados
    }



    if (loggar) console.log('localId', localId, capsula, this.formGroup.controls);
    this.service.Progress = true;
    this.service.httpPost('minha-jurisdicao', capsula)
      .subscribe(r => {
        this.service.Progress = false;
        this.registros = r.lista;
        if (loggar) console.log('registros', this.registros);
        this.dataSource = new MatTableDataSource(this.registros);
        this.dataSource.paginator = this.paginator;

        this.service.httpGet('municipios-vinculados/' + this.registros[0].jurisdict_id)
          .subscribe(data => {
            this.locais = data.lista;
            if (loggar) console.log('locais', this.locais);
          }, err => console.log(err));

      }, erro => {
        this.service.Progress = false;
        this.textoBusca = '';
        console.log(erro);
      });
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.textoBusca = filterValue;
    this.dataSource.filter = filterValue;
  }

  editar(element: any) {
    if (loggar) console.log('element', element);
    this.router.navigate(['cadastro-usuario', element.id]);
  }

  verificar(element: any) {
    if (loggar) console.log('verificar', element);
    this.service.httpPut('user-verify-by-admin/' + element.crediceara_id, { id: element.cpf })
      .subscribe(r => {
        if (r.codeErro === 0) {
          this.listar(this.lastAgenteId);
        } else
          this.service.snackBar.open(r.message, 'OPS', { duration: 5000 });
      }, error => console.log(error));
  }

  corrigir(element: any) {
    let _dialog = this._dialog.open(CorrecaoDadosBasicosComponent, {
      data: {
        element: element
      },
      width: '50%',
      height: '60%'
    });
    _dialog.afterClosed().subscribe(ret => {
      this.textoBusca = ret.registro.name;
      this.listar(this.lastAgenteId);
    });
  }

  definirAgente(element: any) {
    let _dialog = this._dialog.open(AtrbuirAgenteComponent, {
      data: {
        element: element,
        id: element.jurisdict_id
      },
      width: '50%',
      height: '60%'
    });
    _dialog.afterClosed().subscribe(ret => {
      this.textoBusca = ret.registro.name;
      this.listar(this.lastAgenteId);
    });
  }

  atribuirParaMin(element: any) {
    this.service.httpPut('atribuir-para-mim/' + element.id, { agente: this.service.UserId })
      .subscribe(r => {
        if (r.codeErro !== 0)
          this.service.snackBar.open('Não foi possível atribuir o agente.', 'Aviso', { duration: 5000 });
        this.listar(this.lastAgenteId);
      }, err => console.log(err));
  }

  excluir(element: any) {
    if (loggar) console.log('excluir', element);
    /*this.service.httpDelete('user/' + element.crediceara_id)
      .subscribe(r => {
        if (r.codeErro === 0) {
          this.listar();
        }
      }, error => console.log(error));*/
  }
  refresh() {
    this.listar(this.lastAgenteId);
  }

}
