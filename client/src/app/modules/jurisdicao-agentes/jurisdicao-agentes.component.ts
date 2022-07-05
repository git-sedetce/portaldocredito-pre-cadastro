import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-jurisdicao-agentes',
  templateUrl: './jurisdicao-agentes.component.html',
  styleUrls: ['./jurisdicao-agentes.component.scss']
})
export class JurisdicaoAgentesComponent implements OnInit {


  agentesDisponiveis: any[];
  agentesVinculados: any[];
  id: number;
  jurisdicao: any;
  locais: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fp: FormBuilder,
    public service: ExternalService,
  ) {
    this.id = this.route.snapshot.params.id;

    this.agentesDisponiveis = [];
    this.agentesVinculados = [];
  }

  ngOnInit(): void {
    this.service.httpGet('jurisdicao/' + this.id)
      .subscribe(res => {
        this.jurisdicao = res.registro;
        if (loggar) console.log('jurisdicao', this.jurisdicao);
      }, err => console.log(err));

    this.service.httpGet('municipios-vinculados/' + this.id)
      .subscribe(data => {
        this.locais = data.lista;
        if (loggar) console.log('locais', this.locais);
      }, err => console.log(err));
    // 
    this.carregaDisponiveis();
    this.carregaVinculados();
  }

  carregaDisponiveis() {
    this.service.httpGet('agentes-disponiveis')
      .subscribe(data => {
        this.agentesDisponiveis = data.lista;
        if (loggar) console.log('this.agentesDisponíveis', this.agentesDisponiveis);
      }, err => console.log(err));
  }

  carregaVinculados() {
    this.service.httpGet('agentes-vinculados/' + this.id)
      .subscribe(data => {
        this.agentesVinculados = data.lista;
        if (loggar) console.log('agentesVinculados', this.agentesVinculados);
      }, err => console.log(err));

  }

  checkedAgente(item: any, muni: any) {
    if (loggar) console.log('checkedMunicipio', item, muni);
    let reg = { jurisdicaoId: this.id, agenteId: muni };
    this.service.httpPost('jurisdicao-agente', reg)
      .subscribe(res => {
        if (res.codeErro === 0) {
          this.carregaDisponiveis();
          this.carregaVinculados();
        }
      }, err => console.log(err));
  }
  unCheckedAgente(item: any, muni: any) {
    if (loggar) console.log('checkedMunicipio', item, muni);
    this.service.httpDelete('jurisdicao-agente/' + muni)
      .subscribe(res => {
        if (res.codeErro === 0) {
          this.carregaDisponiveis();
          this.carregaVinculados();
        }
      }, err => console.log(err));
  }
  jurisdicoes() {
    this.router.navigate(['jurisdicoes']);
  }
  addLocais() {
    this.router.navigate(['jurisdicao-locais', this.id]);
  }
}
