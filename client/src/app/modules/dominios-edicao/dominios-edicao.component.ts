import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Domain } from 'src/app/models/models';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-dominios-edicao',
  templateUrl: './dominios-edicao.component.html',
  styleUrls: ['./dominios-edicao.component.scss']
})
export class DominiosEdicaoComponent implements OnInit {

  formGroup: FormGroup;
  registro: Domain;

  constructor(
    private service: ExternalService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DominiosEdicaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (loggar) console.log('data', data);
    if (data.id === 0)
      this.registro = new Domain(0);
    else
      this.registro = data.element;

      // this.tipoDominio = data.tipo;
    this.createForm();
  }

  ngOnInit(): void {

    this.createForm();

  }
  createForm() {
    this.formGroup = this._formBuilder.group({
      id: new FormControl(this.registro.id),
      code: new FormControl(this.registro.code),
      name: new FormControl(this.registro.name),
      domain_type: new FormControl(this.data.tipo)
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  private prepareToSave(formModel: Domain): void {
    this.registro = { ...this.registro, ...formModel };
  }

  save(formGroup: Domain) {
    this.prepareToSave(formGroup);

    if (loggar) console.log('save registro', this.registro);
    this.service
      .save(this.registro.id, "domain", this.registro)
      .subscribe((ret) => {
        if (loggar) console.log('domain', ret);
        if (ret.codeErro > 0) {
          this.service.snackBar.open(
            ret.message.detail,
            "Ops!",
            {
              duration: 5000
            }
          );
        } else this.dialogRef.close();
        console.log("save", ret);
      });
  }
  excluir() {
    this.service.httpDelete('domain/' + this.data.id)
      .subscribe(r => {
        if (r.codeErro === 0) {
          this.service.snackBar.open('Registro excluído com sucesso!', 'Show!', { duration: 5000 });
          this.dialogRef.close();
        } else this.service.snackBar.open('O registro não pôde ser excluído!', 'Ops!', { duration: 5000 });
      }, erro => console.log(erro));
  }

}


