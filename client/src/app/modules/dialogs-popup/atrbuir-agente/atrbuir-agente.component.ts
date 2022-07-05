import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CriptografarMD5, loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  templateUrl: './atrbuir-agente.component.html',
  styleUrls: ['./atrbuir-agente.component.scss']
})
export class AtrbuirAgenteComponent implements OnInit {

  formGroup: any;
  agentes: any[];

  constructor(
    private service: ExternalService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<AtrbuirAgenteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
    if (loggar) console.log('data ', data);
    this.formGroup = this.formBuilder.group({
      AgenteId: new FormControl(null, [Validators.required]),
      UserId: new FormControl(this.data.element.id)
    });
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      AgenteId: new FormControl(null, [Validators.required]),
      UserId: new FormControl(this.data.element.id)
    });
    this.service.httpGet("agentes-jurisdicao/" + this.data.id).subscribe((res) => {
      this.agentes = res.lista;
    }, (erro) => console.log(erro));
  }

  save(form: any): void {
    if (loggar) console.log('form', form);
    const confirmacao = {
      AgenteId: form.AgenteId,
      UserId: form.UserId
    };

    this.service.httpPost('agente-juristicao', confirmacao)
      .subscribe((result) => {
        if (loggar) console.log('agente-juristicao', result);
        if (result.codeErro > 0)
          this.service.snackBar.open(result.message, 'OPS!', { duration: 5000 });
        else {
          this.dialogRef.close(result);
        }
      });
  }

}
