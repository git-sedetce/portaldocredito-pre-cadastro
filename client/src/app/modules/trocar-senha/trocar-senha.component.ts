import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CriptografarMD5, loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  templateUrl: './trocar-senha.component.html',
  styleUrls: ['./trocar-senha.component.scss']
})
export class TrocarSenhaComponent implements OnInit {


  formGroup: FormGroup;
  nomeCidadao: string;
  texto: string;

  constructor(
    private service: ExternalService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<TrocarSenhaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      cpf: new FormControl('', [Validators.required]),
      codigo: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmacao: new FormControl('', [Validators.required])
    });
  }

  onClick(form: any): void {
    if (loggar) console.log('form', form);
    const confirmacao = {
      cpf: form.cpf,
      password: CriptografarMD5(form.password),
      codigo: form.codigo
    };

    this.service.httpPost('tochange-password', confirmacao)
      .subscribe((result) => {
        if (loggar) console.log('tochange-password', result);
        if (result.codeErro > 0)
          this.service.snackBar.open(result.message, 'OPS!', { duration: 5000 });
        else {
          this.dialogRef.close(result);
        }
      });
  }

}
