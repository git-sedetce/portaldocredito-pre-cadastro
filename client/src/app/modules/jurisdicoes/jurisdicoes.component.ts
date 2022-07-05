import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Jurisdicao } from 'src/app/models/models';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-jurisdicoes',
  templateUrl: './jurisdicoes.component.html',
  styleUrls: ['./jurisdicoes.component.scss']
})
export class JurisdicoesComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  formGroup: FormGroup;
  supervisores: any[];
  postos: any[];
  registro: Jurisdicao;
  erroMsg: any[];
  jurisdicoes: any[];
  registros: any;
  displayedColumns = [
    "id",
    "name",
    "sede",
    "posto",
    "supervisor",
    "locais",
    "agentes",
    "clientes",
    "acao"
  ];
  dataSource;
  regioes: any[];
  sedes: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fp: FormBuilder,
    public service: ExternalService,
  ) {
    this.registro = new Jurisdicao(0);
    this.createForm();
    this.erroMsg = [];
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addAgentes(element: any) {
    this.router.navigate(['jurisdicao-agentes', element.id]);
  }

  addLocais(element: any) {
    this.router.navigate(['jurisdicao-locais', element.id]);
  }

  refresh() {
    this.listar();
  }

  excluir(element: any) {
    this.service.httpDelete('jurisdicao/' + element.id).subscribe(r => {
      this.listar();
    }, err => console.log(err));
  }

  editar(element: any) {
    if (loggar) console.log('editar', element)
    this.registro.id = element.id;
    this.registro.Nome = element.name;
    this.registro.PostoId = element.post;
    this.registro.SupervisorId = element.supervisor;
    this.registro.RegiaoId = element.regional_id;
    this.registro.SedeId = element.city_id;
    this.createForm();
  }

  ngOnInit(): void {
    this.service.httpGet("people/Supervisor").subscribe((res) => {
      this.supervisores = res.lista;
      if (loggar) console.log('supervisores', this.supervisores);
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/Posto").subscribe((res) => {
      this.postos = res.lista;
      if (loggar) console.log('postos', this.postos);
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/Municipio").subscribe((res) => {
      this.sedes = res.lista;
      if (loggar) console.log('sedes', this.sedes);
    }, (erro) => console.log(erro));
    this.service.httpGet("domains/MacroRegiao").subscribe((res) => {
      this.regioes = res.lista;
      if (loggar) console.log('regioes', this.regioes);
    }, (erro) => console.log(erro));
    this.listar();
  }
  listar() {
    this.service.httpGet('jurisdicoes').subscribe(res => {
      this.registros = res.lista;
      if (loggar) console.log('registros', res, this.registros);
      this.dataSource = new MatTableDataSource(this.registros);
      this.dataSource.paginator = this.paginator;
    }, error => console.log(error));
  }

  private getValueMsg(valor: any, field: string, msg: string) {
    this.erroMsg.push({ key: field, value: msg });
    // if (loggar) console.log('get ValueMsg', this.erroMsg);
    return valor;
  }

  private prepareToSave(formModel: any): void {
    this.registro = { ...this.registro, ...formModel };
  }


  createForm() {
    this.formGroup = this._fp.group({
      Nome: new FormControl('-'),
      RegiaoId: new FormControl(this.registro.RegiaoId, [Validators.required]),
      PostoId: new FormControl(this.registro.PostoId, [Validators.required,]),
      SupervisorId: new FormControl(this.registro.SupervisorId, [Validators.required]),
      SedeId: new FormControl(this.registro.SedeId, [Validators.required]),
    });

  }
  save(formGroup: any) {
    const erros = this.service.findInvalidControls(this.formGroup, this.erroMsg);

    if (erros.length === 0) {
      this.prepareToSave(formGroup);

      if (loggar) console.log('save registro', this.registro);
      this.service
        .save(this.registro.id, "jurisdicao", this.registro)
        .subscribe((ret) => {
          if (ret.codeErro === 0) {
            this.registro = new Jurisdicao(0);
            this.createForm();
            this.listar();
          }
          if (loggar) console.log('jurisdicao', ret);
        });
    }
  }

  search() {

  }

}
