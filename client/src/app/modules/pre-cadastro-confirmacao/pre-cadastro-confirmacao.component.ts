import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-access',
  templateUrl: './pre-cadastro-confirmacao.component.html',
  styleUrls: ['./pre-cadastro-confirmacao.component.scss'],
})
export class PreCadastroConfirmacaoComponent implements OnInit {
  formGroup: FormGroup;
  nomeCidadao: string;
  texto: string;

  constructor(
    private service: ExternalService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<PreCadastroConfirmacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (loggar) console.log('data', data);
    this.createForm();
    this.nomeCidadao = data.NomeCidadao;
    if (data.id === 0) {
      this.nomeCidadao = 'cidadão';
      this.texto = ` Prezado(a)  ${this.nomeCidadao}, lhe foi enviado um email e um SMS com um código no formato NNN.NNN. Informe seu CPF e o código recebido para que possamos confirmar seu cadastro`;
    } else {
      this.texto = 'Agora você vai receber um SMS com um código de confirmação do seu cadastro. O mesmo código será enviado para o email informado. Caso '
    }
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      id: new FormControl(this.data.id),
      cpf: new FormControl(this.data.cpf),
      codigo: new FormControl(''),
    });
  }

  ngOnInit(): void { }

  onNoClick(): void {
    this.dialogRef.close({ codeErro: 1, canceled: true });
  }
  noCode(form: any) {
    this.service.httpGet('resend-code/' + form.cpf)
      .subscribe(ret => {
        if (ret.codeErro === 0) {
          this.service.snackBar.open('Um novo código foi enviado para o seu e-mail e celular', 'OK', { duration: 5000 });
          this.formGroup.controls['id'].setValue(ret.id);
        } else if (ret.codeErro === 1) {
          this.service.snackBar.open('O CPF informado não foi encontrado!', 'OPS!', { duration: 5000 });
        } else if (ret.codeErro === 2) {
          this.service.snackBar.open('Seu pré-cadastro já está validado!', 'OK', { duration: 5000 });
        }
      }, error => console.log(error));
  }
  onClick(form: any): void {
    const confirmacao = {
      id: form.id,
      cpf: form.cpf,
      codigo: form.codigo
    };

    this.service.httpPost('code-verify', confirmacao)
      .subscribe((result) => {
        if (loggar) console.log('code-verify', result);
        if (result.codeErro > 0)
          this.service.snackBar.open('Código inválido', 'OPS!', { duration: 5000 });
        else {
          this.router.navigate(['cadastro-usuario', result.id]);
          result.canceled = false;
          this.dialogRef.close(result);
        }
      });
  }
}
