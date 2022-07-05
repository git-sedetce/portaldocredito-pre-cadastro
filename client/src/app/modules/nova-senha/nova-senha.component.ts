import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.scss']
})
export class NovaSenhaComponent implements OnInit {


  formGroup: FormGroup;
  nomeCidadao: string;
  texto: string;

  constructor(
    private service: ExternalService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<NovaSenhaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      cpf: new FormControl('', [Validators.required])
    });
  }

  onClick(form: any): void {
    const confirmacao = {
      cpf: form.cpf
    };

    this.service.httpPost('request-code-new-password', confirmacao)
      .subscribe((result) => {
        if (loggar) console.log('request-code-new-password', result);
        if (result.codeErro > 0)
          this.service.snackBar.open(result.message, 'OPS!', { duration: 5000 });
        else {
          
          this.dialogRef.close(result);
        }
      });
  }

}
