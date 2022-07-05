import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { loggar } from '../../services/constantes';
import { ExternalService } from '../../services/external.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  public versao: string;
  public contadores: any;
  constructor(public service: ExternalService, private router: Router) {
    this.versao = environment.versao;
    this.contadores = {
      qtd_hoje: 0, qtd_7dias: 0, qtd_15dias: 0, qtd_30dias: 0, qtd_6meses: 0, qtd_verificados: 0, total: 0
    }
  }
  ngOnInit() {
    this.service.httpGet("dashboard-login")
      .subscribe((res) => {
        if (loggar) console.log('contadores', res);
        this.contadores = res.registro;
      }, (erro) => console.log(erro));
  }

  toggleSideBar() {
    if (this.service.Perfil.toLowerCase() !== 'Cidadão') {
      this.toggleSideBarForMe.emit();
      setTimeout(() => {
        window.dispatchEvent(
          new Event('resize')
        );
      }, 300);
    }

  }

  logout() {
    this.service.sideBarOpen = false;
    this.service.Perfil = '';
    this.router.navigate(['/login']);
  }

}
