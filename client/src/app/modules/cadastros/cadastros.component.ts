import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';
import { CorrecaoDadosBasicosComponent } from '../correcao-dados-basicos/correcao-dados-basicos.component';
import { TrocePerfilComponent } from '../troce-perfil/troce-perfil.component';

@Component({
  selector: 'app-cadastros',
  templateUrl: './cadastros.component.html',
  styleUrls: ['./cadastros.component.scss']
})
export class CadastrosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns = [
    "id",
    "cpf",
    "nomeCidadao",
    "foneCelular",
    "email",
    "sexo",
    "status",
    "scores",
    "enviado",
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
  titulo: string;
  constructor(
    public service: ExternalService,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private router: Router) {

  }

  ngOnInit(): void {
    if (this.route.snapshot.params.id)
      this.elegiveis = this.route.snapshot.params.id;
    else
      this.elegiveis = 'T';

    if (this.elegiveis === 'T')
      this.titulo = 'Cadastros de Clientes / Cidadãos (Todos)';
    else if (this.elegiveis === 'A')
      this.titulo = 'Cadastros de Agentes de Créditos';
    else if (this.elegiveis === 'S')
      this.titulo = 'Cadastros de Supervisores';
    else
      this.titulo = 'Cadastros ';

    this.listar();
    this.admin = (this.service.Perfil.toLowerCase() === 'admin');
  }



  search() {
    this.listar();
  }
  listar() {

    this.service.Progress = true;
    this.service.httpPost('cadastros-list', { date: '2021-01-01', elegiveis: this.elegiveis, texto: this.textoBusca })
      .subscribe(r => {
        this.service.Progress = false;
        if (loggar) console.log('cadastros-list', r);
        this.registros = r.lista;
        if (loggar) console.log('listar', this.registros);
        this.dataSource = new MatTableDataSource(this.registros);
        this.dataSource.paginator = this.paginator;
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
    this.router.navigate(['cadastro-usuario', element.crediceara_id]);
  }

  verificar(element: any) {
    if (loggar) console.log('verificar', element);
    this.service.httpPut('user-verify-by-admin/' + element.crediceara_id, { id: element.cpf })
      .subscribe(r => {
        if (r.codeErro === 0) {
          this.listar();
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
      this.textoBusca = ret.Nome;
      this.listar();
    });
  }

  alterarPerfil(element: any) {
    let _dialog = this._dialog.open(TrocePerfilComponent, {
      data: {
        element: element,
      },
      width: '50%',
      height: '60%'
    });
    _dialog.afterClosed().subscribe(ret => {
      this.textoBusca = ret.Nome;
      this.listar();
    });

  }

  resetPassword(element: any) {
    this.service.httpPost('reset-password-admin', { user: element })
      .subscribe(r => {
        if (r.codeErro === 0) {
          this.service.snackBar.open('Um email foi enviado para o usuário com uma nova senha', 'Atenção', { duration: 5000 });
        }
      }, error => console.log(error));
  }

  excluir(element: any) {
    if (loggar) console.log('excluir', element);
    this.service.httpDelete('user/' + element.crediceara_id)
      .subscribe(r => {
        if (r.codeErro === 0) {
          this.listar();
        }
      }, error => console.log(error));
  }
  refresh() {
    this.listar();
  }
}
