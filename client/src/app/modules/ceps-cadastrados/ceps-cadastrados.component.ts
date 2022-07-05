import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-ceps-cadastrados',
  templateUrl: './ceps-cadastrados.component.html',
  styleUrls: ['./ceps-cadastrados.component.scss']
})
export class CepsCadastradosComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  displayedColumns = [
    "id",
    "localidade",
    "bairro",
    "cep",
    "logradouro",
    "complemento",
    "ibge",
    "uf",
    "ddd"
  ];
  dataSource;
  _registros: any;
  constructor(private service: ExternalService) { }

  ngOnInit(): void {
    this.service.httpGet('ceps')
      .subscribe(r => {
        this._registros = r.lista;
        if (loggar) console.log('ceps', this._registros);
        this.dataSource = new MatTableDataSource(this._registros);
        this.dataSource.paginator = this.paginator;
      }, erro => console.log(erro));

  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
