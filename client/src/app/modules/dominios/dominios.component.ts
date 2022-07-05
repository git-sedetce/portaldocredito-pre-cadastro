import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';
import { DominiosEdicaoComponent } from '../dominios-edicao/dominios-edicao.component';

@Component({
  selector: 'app-dominios',
  templateUrl: './dominios.component.html',
  styleUrls: ['./dominios.component.scss']
})
export class DominiosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns = [
    "id",
    "code",
    "name",
    "descrition",
    "domain_value",
    // "is_active",
    "Acao"
  ];
  dataSource;
  tipoDominio: string;
  dominios: any[];
  private _Registros: any;
  constructor(private service: ExternalService, private dialog: MatDialog) {
    this.tipoDominio = '';
  }

  ngOnInit(): void {
    this.service.httpGet('kindofdomain')
      .subscribe(r => {
        this.dominios = r.lista;
      });
    this.listar();
  }

  listar(): void {

    this.service.httpGet('domains/' + this.tipoDominio)
      .subscribe(r => {
        this._Registros = r.lista;
        if (loggar) console.log('listar', this._Registros);
        this.dataSource = new MatTableDataSource(this._Registros);
        this.dataSource.paginator = this.paginator;
      }, erro => console.log(erro));

  }

  selectedTipo() {
    if (loggar) console.log('selectedTipo', this.tipoDominio);
    this.listar();
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editar(element) {
    const dialogRef = this.dialog.open(DominiosEdicaoComponent, {
      width: '500px',
      data: {
        id: element.id,
        element: element,
        tipo: this.tipoDominio
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listar();
    });
  }
  add() {
    const dialogRef = this.dialog.open(DominiosEdicaoComponent, {
      width: '500px',
      data: {
        id: 0,
        element: null,
        tipo: this.tipoDominio
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listar();
    });
  }

}
