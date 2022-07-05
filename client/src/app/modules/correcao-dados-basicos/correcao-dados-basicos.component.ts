import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { CriptografarMD5, loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  templateUrl: './correcao-dados-basicos.component.html',
  styleUrls: ['./correcao-dados-basicos.component.scss']
})
export class CorrecaoDadosBasicosComponent implements OnInit {


  formGroup: FormGroup;
  nomeCidadao: string;
  texto: string;

  constructor(
    private service: ExternalService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<CorrecaoDadosBasicosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (loggar) console.log('data', data);
    this.formGroup = this.formBuilder.group({
      Nome: new FormControl(data.element.nomeCidadao, [Validators.required]),
      cpf: new FormControl(data.element.cpf, [Validators.required]),
      email: new FormControl(data.element.email, [Validators.required]),
      celular: new FormControl(data.element.foneCelular, [Validators.required])
    });
  }

  ngOnInit(): void {

  }

  onClick(form: any): void {
    if (loggar) console.log('form', form);
    const confirmacao = {
      cpf: form.cpf,
      Nome: form.Nome,
      email: form.email,
      celular: form.celular
    };

    this.service.httpPut('correcao-dados-basicos/' + this.data.element.crediceara_id, confirmacao)
      .subscribe((result) => {
        if (loggar) console.log('correcao-dados-basicos', result);
        if (result.codeErro > 0)
          this.service.snackBar.open(result.message, 'OPS!', { duration: 5000 });
        else {
          this.dialogRef.close(result);
        }
      });
  }

}
