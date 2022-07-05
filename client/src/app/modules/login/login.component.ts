import { Component, OnInit } from "@angular/core";
import {
  MatDialog,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { ExternalService } from "src/app/shared/services/external.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { PreCadastro } from "src/app/models/models";
import { CriptografarMD5, loggar } from "src/app/shared/services/constantes";
import { PreCadastroConfirmacaoComponent } from "../pre-cadastro-confirmacao/pre-cadastro-confirmacao.component";
import { DlgMessageComponent } from "src/app/shared/dlg-message/dlg-message.component";
import { TrocarSenhaComponent } from "../trocar-senha/trocar-senha.component";
import { NovaSenhaComponent } from "../nova-senha/nova-senha.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;

  cidades: any[];
  registro: { eMail: string, password: string }; // PreCadastro;
  local: boolean;
  cadastrar: boolean;
  localhost: boolean;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fp: FormBuilder,
    private _dialog: MatDialog,
    private service: ExternalService
  ) {
    document.title = "Login Administrativo - CrediCeara";
    this.cidades = [
      { id: 1, texto: "Fortaleza" },
      { id: 2, texto: "Limoeiro do Norte" },
      { id: 3, texto: "Beberibe" },
    ];
    this.cadastrar = false;
    this.localhost = loggar;
    // this.registro = new PreCadastro(0);
    this.registro = { eMail: '', password: '' }
    this.createForm();
  }

  onCadastrar() {
    this.router.navigate(['pre-cadastro']);
  }

  faleConosco() {
    this.router.navigate(['fale-conosco']);
  }

  informarCodigo() {
    let diag = this._dialog.open(PreCadastroConfirmacaoComponent, {
      data: {
        id: 0,
        NomeCidadao: '',
        cpf: ''
      },
      width: '90%',
      maxWidth: '400px',
      height: '65%'
    });

    diag.afterClosed().subscribe(user => {
      if (user.codeErro === 0)
        this.router.navigate(["cadastro-usuario", user.id]);

    });
  }
  createForm() {
    this.formGroup = this._fp.group({
      Nome: new FormControl(""),
      DataNascimento: new FormControl(""),
      CPF: new FormControl(""),
      Celular: new FormControl(""),
      eMail: new FormControl(""),
      password: new FormControl(""),
    });
  }



  ngOnInit() {
    if (this.service.Perfil === 'admin')
      this.router.navigate['/']
    //this.router.navigate(['fdif']);
    this.local = loggar;

  }
  onNoClick() {
    this.save(this.formGroup.value);
  }

  doTest() {
    this.service.httpGet('jwt-check/0')
      .subscribe(t => {
        let token = t.token;
        //this.router.navigate(['/?token=' + token]);
        window.open('/?token=' + token, '_blank');
      }, erro => console.log(erro));
  }

  private prepareToSave(formModel: any): void {
    this.registro = { ...this.registro, ...formModel };
  }

  save(formGroup: PreCadastro) {
    let horizontalPosition: MatSnackBarHorizontalPosition = "center";
    let verticalPosition: MatSnackBarVerticalPosition = "top";
    this.prepareToSave(formGroup);
    this.registro.password = CriptografarMD5(this.registro.password);
    this.service
      .save(0, "login", this.registro)
      .subscribe((ret) => {
        if (ret.codeErro > 0) {
          this.service.snackBar.open(
            ret.message,
            "Ops!",
            {
              duration: 10000,
              horizontalPosition: horizontalPosition,
              verticalPosition: verticalPosition,
            }
          );
        } else {
          // this.router.navigate(["dashboard"]);
          if (loggar) console.log('user', ret);
          this.service.Perfil = ret.user.Perfil;
          this.service.UserEmail = ret.user.email;
          this.service.UserPhone = ret.user.Celular;
          this.service.UserName = ret.user.Nome;
          this.service.UserId = ret.user.id;
          this.service.Status = ret.user.status;
          if (ret.user.cpf === '44086423391')
            this.service.Perfil = 'admin';
          if (['Agente de Crédito', 'Supervisor'].indexOf(this.service.Perfil) !== -1) {
            this.router.navigate(["/minha-jurisdicao"]);
          } else if (this.service.Perfil !== 'Cidadão') {
            this.service.sideBarOpen = false;
            this.router.navigate(["/cadastros", 'T']);

          } else if (this.service.Status !== 'Verificado') {
            let dialog = this._dialog.open(DlgMessageComponent, {
              data: {
                titulo: 'Atenção ao Cadastro',
                message: ['Prezado cidadão, seu perfil ainda não foi verificado. Para que você possa seguir no cadastro, é necessário que seu cadastro seja verificado.']
              },
              width: "95%",
              maxWidth: "500px",
              height: "55%"
            });
            dialog.afterClosed().subscribe(r => {

            });
          }
          else {
            this.service.UserId = ret.id;
            this.router.navigate(["cadastro-usuario", ret.id]);
          }

        }
        console.log("save", ret);
      });
  }

  changePassword() {
    let diag = this._dialog.open(TrocarSenhaComponent, {
      data: {
      },
      width: '90%',
      maxWidth: '400px',
      height: '65%'
    });
    diag.afterClosed().subscribe(user => {
      if (user.codeErro === 0)
        this.service.snackBar.open(user.message, 'OK', { duration: 5000 });
      this.router.navigate(["login"]);
    });
  }
  newPassword() {
    let diag = this._dialog.open(NovaSenhaComponent, {
      data: {
      },
      width: '90%',
      maxWidth: '400px'
    });
    diag.afterClosed().subscribe(user => {
      this.service.snackBar.open(user.message, 'Tudo certo!', { duration: 10000 });
      if (user.codeErro === 0)
        this.router.navigate(["login"]);

    });
  }
}
