import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-jurisdcao-locais',
  templateUrl: './jurisdcao-locais.component.html',
  styleUrls: ['./jurisdcao-locais.component.scss']
})
export class JurisdicaoLocaisComponent implements OnInit {
  id: number;
  jurisdicao: any;
  cidadesdisponiveis: any[];
  municipiosvinculados: any[];
  bairrosdisponiveis: any[];
  bairrosvinculados: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fp: FormBuilder,
    public service: ExternalService,
  ) {
    this.id = this.route.snapshot.params.id;
    this.municipiosvinculados = [];
    this.cidadesdisponiveis = [];
    this.bairrosdisponiveis = [];
    this.bairrosvinculados = [];
  }

  ngOnInit(): void {
    this.service.httpGet('jurisdicao/' + this.id)
      .subscribe(res => {
        this.jurisdicao = res.registro;
        if (loggar) console.log('jurisdicao', this.jurisdicao);
      }, err => console.log(err));
    this.carregaDisponiveis();
    this.carregaVinculados();
  }
  carregaDisponiveis() {
    this.service.httpGet('municipios-disponiveis')
      .subscribe(data => {
        this.cidadesdisponiveis = data.lista;
        if (loggar) console.log('this.cidadesdisponiveis', this.cidadesdisponiveis);
      }, err => console.log(err));
    this.service.httpGet('bairros-disponiveis')
      .subscribe(data => {
        this.bairrosdisponiveis = data.lista;
        if (loggar) console.log('this.bairrosdisponiveis', this.bairrosdisponiveis);
      }, err => console.log(err));
  }

  carregaVinculados() {
    this.service.httpGet('municipios-vinculados/' + this.id)
      .subscribe(data => {
        this.municipiosvinculados = data.lista;
        if (loggar) console.log('municipiosvinculados', this.municipiosvinculados);
      }, err => console.log(err));
    this.service.httpGet('bairros-vinculados/' + this.id)
      .subscribe(data => {
        this.bairrosvinculados = data.lista;
        if (loggar) console.log('bairrosvinculados', this.bairrosvinculados);
      }, err => console.log(err));

  }

  checkedMunicipio(item: any, muni: any) {
    if (loggar) console.log('checkedMunicipio', item, muni);
    let reg = { jurisdicaoId: this.id, municipio: muni };
    this.service.httpPost('jurisdicao-local', reg)
      .subscribe(res => {
        if (res.codeErro === 0) {
          this.carregaDisponiveis();
          this.carregaVinculados();
        }
      }, err => console.log(err));
  }
  checkedBairro(item: any, muni: any) {
    if (loggar) console.log('checkedMunicipio', item, muni);
    let reg = { jurisdicaoId: this.id, bairro: muni };
    this.service.httpPost('jurisdicao-bairro', reg)
      .subscribe(res => {
        if (res.codeErro === 0) {
          this.carregaDisponiveis();
          this.carregaVinculados();
        }
      }, err => console.log(err));
  }
  unCheckedMunicipio(item: any, muni: any) {
    if (loggar) console.log('checkedMunicipio', item, muni);
    this.service.httpDelete('jurisdicao-local/' + muni)
      .subscribe(res => {
        if (res.codeErro === 0) {
          this.carregaDisponiveis();
          this.carregaVinculados();
        }
      }, err => console.log(err));
  }
  unCheckedBairro(item: any, muni: any) {
    if (loggar) console.log('unCheckedBairro', item, muni);
    this.service.httpDelete('jurisdicao-bairro/' + muni)
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
  addAgentes() {
    this.router.navigate(['jurisdicao-agentes', this.id]);
  }


}
