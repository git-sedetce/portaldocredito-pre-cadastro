import { Component, OnInit } from '@angular/core';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-pos-cadastro',
  templateUrl: './pos-cadastro.component.html',
  styleUrls: ['./pos-cadastro.component.scss']
})
export class PosCadastroComponent implements OnInit {
  elegivel: boolean;

  constructor(
    private service: ExternalService
  ) {
    this.elegivel = this.service.Elegivel;
  }

  ngOnInit(): void {
  }

}
