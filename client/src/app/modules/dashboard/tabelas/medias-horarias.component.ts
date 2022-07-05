import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-medias-horarias',
  templateUrl: './medias-horarias.component.html',
  styleUrls: ['./medias-horarias.component.scss']
})
export class MediasHorariasComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns = [
    "ano",
    // "mes",
    // "dia",
    "hora",
    "total",
    // "media",
    "verificado",
    "nao_verificado",
    "elegivel",
    "nao_elegivel",
    "capital",
    "interior"
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

  getServerData(event: any) {
    console.log('paginator', event);
  }
  search() {
    this.listar();
  }
  listar() {

    this.service.Progress = true;
    this.service.httpGet('media-horaria')
      .subscribe(r => {
        this.service.Progress = false;
        if (loggar) console.log('media-horaria', r);
        this.registros = r.lista;
        let index = 0;
        let soma = 0;
        let media = 0;
        /*this.registros.forEach(item => {
          index++;
          soma = soma + item.total;
          media = soma / index;
          item.media = media;
        });*/
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
