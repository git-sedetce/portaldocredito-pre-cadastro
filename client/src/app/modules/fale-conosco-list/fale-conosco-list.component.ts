import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-fale-conosco-list',
  templateUrl: './fale-conosco-list.component.html',
  styleUrls: ['./fale-conosco-list.component.scss']
})
export class FaleConoscoListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns = [
    'id',
    'subject',
    'name',
    'cpf',
    'phone_number',
    'email',
    'descrition',
  ];
  dataSource;
  registros: any[];
  elegiveis: any;
  admin: boolean;
  textoBusca: string;
  constructor(
    public service: ExternalService,
    private route: ActivatedRoute,
    private _dialog: MatDialog,
    private router: Router) {
    if (this.route.snapshot.params.id)
      this.elegiveis = this.route.snapshot.params.id;
    else
      this.elegiveis = 'T';
    this.dataSource = null;
  }

  ngOnInit(): void {
    this.listar();
    this.admin = (this.service.Perfil.toLowerCase() === 'admin');
  }

  search() {
    this.listar();
  }
  listar() {

    this.service.Progress = true;
    this.service.httpGet('fale-conosco-list')
      .subscribe(r => {
        this.service.Progress = false;
        if (loggar) console.log('fale-conosco-list', r);
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

  refresh() {
    this.listar();
  }

}
