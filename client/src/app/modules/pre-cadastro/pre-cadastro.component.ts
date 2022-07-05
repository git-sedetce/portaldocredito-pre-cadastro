import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DlgMessageComponent } from 'src/app/shared/dlg-message/dlg-message.component';
import { CriptografarMD5, loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';
import { PreCadastroConfirmacaoComponent } from '../pre-cadastro-confirmacao/pre-cadastro-confirmacao.component';

@Component({
  selector: 'app-pre-cadastro',
  templateUrl: './pre-cadastro.component.html',
  styleUrls: ['./pre-cadastro.component.scss']
})
export class PreCadastroComponent implements OnInit {

  formGroup: FormGroup;
  confirmPassword: string;
  registro: any;

  constructor(
    private servicos: ExternalService,
    private router: Router,
    private _fp: FormBuilder,
    private _dialog: MatDialog,
  ) {
    this.createForm();
    this.confirmPassword = '';
  }

  ngOnInit(): void {
  }

  cancelarCadastro() {
    this.router.navigate(['login']);
  }

  private prepareToSave(formModel: any): void {
    this.registro = { ...this.registro, ...formModel };
    this.registro.DataNascimento = this.servicos.StringToDate(
      formModel.DataNascimento
    );
    this.registro.CPF = formModel.CPF.replace(".", "")
      .replace(".", "")
      .replace("-", "");
    this.registro.Celular = formModel.Celular.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
    console.log(this.registro);

  }

  enviar() {
    this.save(this.formGroup.value);
  }
  save(formGroup: any) {
    this.prepareToSave(formGroup);
    this.registro.password = CriptografarMD5(this.registro.password);
    this.servicos
      .save(0, "pre-cadastro", this.registro)
      .subscribe((ret) => {
        if (ret.codeErro > 0) {
          let dialog = this._dialog.open(DlgMessageComponent, {
            data: {
              titulo: 'Atenção ao Cadastro',
              message: [ret.message]
            },
            width: "95%",
            maxWidth: "500px", 
            height: "55%"
          });
          dialog.afterClosed().subscribe(r => {

          });
          // this.servicos.snackBar.open(ret.message, "Ops!", { duration: 5000 });
        } else {
          // this.router.navigate(["dashboard"]);
          this.servicos.httpPost('sender-sms', { id: ret.id, cpf: this.registro.CPF, PhoneNumber: this.registro.Celular })
            .subscribe(user => {
              if (loggar) console.log('user', user);
              let diag = this._dialog.open(PreCadastroConfirmacaoComponent,
                {
                  data: {
                    id: ret.id,
                    NomeCidadao: this.registro.Nome,
                    cpf: this.registro.CPF
                  },
                  width: '90%',
                  maxWidth: '400px',
                  height: '65%'
                });
              diag.afterClosed().subscribe(ret => {
                if (ret.codeErro === 0)
                  this.router.navigate(["cadastro-usuario", user.id]);

              });

            }, error => console.log(error));

          this.servicos.httpPost('sender-sms', { id: ret.id, cpf: this.registro.CPF, PhoneNumber: this.registro.Celular })
            .subscribe(r => {
              if (loggar) console.log('email enviado', r);
            }, error => console.log(error));
          if (loggar) console.log('user', ret);
        }
        console.log("save", ret);
      });
  }

  validaCPF(cpf: any): boolean {
    return this.servicos.validaCPF(cpf);
  }
  validaEmail(email: any): boolean {
    return this.servicos.validaEmail(email);
  }
  createForm() {
    this.formGroup = this._fp.group({
      Nome: new FormControl("", [Validators.required]),
      DataNascimento: new FormControl("", [Validators.required]),
      CPF: new FormControl("", [Validators.required]),
      Celular: new FormControl("", [Validators.required]),
      eMail: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
  }

}
