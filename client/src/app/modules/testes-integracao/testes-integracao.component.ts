import { Component, OnInit } from '@angular/core';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-testes-integracao',
  templateUrl: './testes-integracao.component.html',
  styleUrls: ['./testes-integracao.component.scss']
})
export class TestesIntegracaoComponent implements OnInit {
  token: any;

  constructor(private service: ExternalService) { }

  ngOnInit(): void {
    this.service.httpGet('jwt-check/0')
      .subscribe(r => {
        this.token = r.token;
        console.log('token', r);
      })
  }

  portal() {
    this.service.httpGet('jwt-check/0')
      .subscribe(t => {
        let token = t.token;
        //this.router.navigate(['/?token=' + token]);
        window.open('/?token=' + token, '_blank');
      }, erro => console.log(erro));
  }

  emailSenha() {
    this.service.httpGet('comunicado')
      .subscribe(t => {
        if (loggar) console.log('t', t);
        this.service.snackBar.open(`Foram enviados ${t.totalRegistros} e-mails`, 'OPS', { duration: 5000 });
      }, erro => console.log(erro));
  }
}
