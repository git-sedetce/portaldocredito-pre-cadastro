import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { loggar } from 'src/app/shared/services/constantes';
import { ExternalService } from 'src/app/shared/services/external.service';

@Component({
  selector: 'app-fale-conosco',
  templateUrl: './fale-conosco.component.html',
  styleUrls: ['./fale-conosco.component.scss']
})
export class FaleConoscoComponent implements OnInit {


  formGroup: FormGroup;
  registro: any;
  assuntos: any[];
  constructor(
    private service: ExternalService,
    private router: Router,
    private _fp: FormBuilder,
    private _dialog: MatDialog,
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    this.service.httpGet("domains/AssuntoFaleConosco").subscribe((res) => {
      this.assuntos = res.lista;
    }, (erro) => console.log(erro));

  }

  validaCPF(cpf: any): boolean {
    return this.service.validaCPF(cpf);
  }
  validaEmail(email: any): boolean {
    return this.service.validaEmail(email);
  }
  enviar() {
    this.save(this.formGroup.value);
  }

  private prepareToSave(formModel: any): void {
    this.registro = { ...this.registro, ...formModel };
    // this.registro.DataNascimento = this.service.StringToDate(      formModel.DataNascimento    );
    this.registro.CPF = formModel.CPF.replace(".", "")
      .replace(".", "")
      .replace("-", "");
    this.registro.Celular = formModel.Celular.replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace(" ", "");
      let assunto = this.assuntos.find(x=> x.id === this.formGroup.value.AssuntoId);
      this.registro.Assunto = assunto.texto;
    console.log(this.registro);

  }
  cancelarCadastro() {
    this.router.navigate(['login']);
  }
  save(formGroup: any) {
    this.prepareToSave(formGroup);
    this.service
      .save(0, "fale-conosco", this.registro)
      .subscribe((ret) => {
        if (ret.codeErro === 0) {
          this.service.snackBar.open('Sua mensagem foi enviada com sucesso e logo será respondida.', 'Mensagem Enviada', { duration: 5000 });
          this.router.navigate(['login']);
        }
        console.log("save", ret);
      }, erro => console.log(erro));
  }
  createForm() {
    this.formGroup = this._fp.group({
      AssuntoId: new FormControl(null, [Validators.required]),
      Assunto: new FormControl(''), 
      Nome: new FormControl("", [Validators.required]),
      CPF: new FormControl("", [Validators.required]),
      Celular: new FormControl("", [Validators.required]),
      eMail: new FormControl("", [Validators.required]),
      Descricao: new FormControl("", [Validators.required]),
    });
  }



}
