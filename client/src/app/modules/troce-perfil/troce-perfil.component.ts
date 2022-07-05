import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CriptografarMD5, loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  templateUrl: './troce-perfil.component.html',
  styleUrls: ['./troce-perfil.component.scss']
})
export class TrocePerfilComponent implements OnInit {
  formGroup: any;
  perfis: any[];
  userName: string;
  userCPF: string;

  constructor(
    private service: ExternalService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<TrocePerfilComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userName = data.element.nomeCidadao;
    this.userCPF = data.element.cpf;
    if (loggar) console.log('data', data);
    this.formGroup = this.formBuilder.group({
      PerfilId: new FormControl(null, [Validators.required]),
      eMail: new FormControl('', [Validators.required]),
      Senha: new FormControl('', [Validators.required]),
      cpf: new FormControl(this.userCPF, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.service.httpGet("domains/PerfilUsuario").subscribe((res) => {
      this.perfis = res.lista;
    }, (erro) => console.log(erro));
  }

  save(form: any): void {
    if (loggar) console.log('form', form);
    const confirmacao = {
      PerfilId: form.PerfilId,
      Senha: CriptografarMD5(form.Senha),
      eMail: form.eMail,
      cpf: form.cpf
    };

    this.service.httpPost('tochange-perfil', confirmacao)
      .subscribe((result) => {
        if (loggar) console.log('tochange-perfil', result);
        if (result.codeErro > 0)
          this.service.snackBar.open(result.message, 'OPS!', { duration: 5000 });
        else {
          this.dialogRef.close(result);
        }
      });
  }

}
