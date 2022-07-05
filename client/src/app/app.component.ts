import { loggar } from "./shared/services/constantes";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ExternalService } from "./shared/services/external.service";
import { MatDialog } from "@angular/material";
import { JwtHelper } from "./shared/access-control/jwt-helper";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "CearaCredi";
  numeroChamador: string;
  numeroChamado: string;
  ramalId: string;
  operador: string;
  user: any;
  userId: any;
  userName: any;
  userNick: any;
  avatar: any;

  constructor(private router: Router, private service: ExternalService) {
    this.service.Perfil = "";
  }

  ngOnInit() {

    this.service.helper = '';
    // let codeVerify = this.GetParam("codev");
    let token = this.GetParam("token");
    if (loggar) console.log('token', token);
    // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJldmVydG9uaWxkb0BnbWFpbC5jb20iLCJjZWx1bGFyIjoiODU5ODgxNDM0MjgiLCJjcGYiOiI0NDA4NjQyMzM5MSIsImlhdCI6MTUxNjIzOTAyMn0.HRiNi-DLJtGv2_e1ii6mTQ_piXcTQ8p_4K8_bLFUQkE';
    if (token) {
      this.service.token = token;
      const jwtHelper = new JwtHelper();
      const decodedToken = jwtHelper.decodeToken(this.service.token);
      this.service.Perfil = decodedToken.login_from.indexOf('Citizen') >= 0 ? 'Cidadão' : decodedToken.login_from;
      if (loggar) console.log("decodedToken", decodedToken);
      this.service.httpPost('loginbytoken', decodedToken)
        .subscribe(r => {
          if (loggar) console.log('retorno', r);

          if (r.codeErro === 0) {
            let reg = r.user;
            if (reg.NomeSocial)
              this.service.UserName = reg.NomeSocial;
            else
              this.service.UserName = reg.Nome;
            this.service.UserEmail = reg.email;
            this.service.UserPhone = reg.Celular;

            this.router.navigate(["cadastro-usuario", r.id]);
          } else {
            this.service.snackBar.open('Problemas no login. Avise ao portal de acesso do cidadão', 'Ops!', { duration: 5000 });
            this.router.navigate(["/"]);
          }
        }, error => console.log(error));

    }

    /*if (codeVerify === "") {
      if (loggar) console.log("Nenhum parametro foi recebido");
      // this.router.navigate(['']);
    } else {
      this.service.httpGet("code-verify/" + codeVerify).subscribe((rest) => {
        if (loggar) console.log("rest", rest);
        let codeErro = rest.codeErro;
        if (codeErro === 0) {
          this.router.navigate(["cadastro-usuario", rest.id]);
        }
      });
    }*/
  }

  GetParam(name): string {
    // console.log('url', window.location);
    const results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(
      window.location.href
    );
    if (!results) {
      return "";
    }
    return results[1] || "";
  }
}
