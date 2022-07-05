import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DlgMessageComponent } from "../dlg-message/dlg-message.component";
import { loggar, _isNullOrEmpty } from "./constantes";

@Injectable({
  providedIn: "root",
})
export class ExternalService {
  validaEmail(email: any): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  validaCPF(cpf: any): any {
    // if (loggar) console.log('cpf', cpf);
    cpf = cpf.replace(/[^\d]+/g, '');
    // verificando se tem a quantidade certa de caracter e se não tem todos caracteres iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf))
      return false;
    let soma = 0,
      resto;
    for (var i = 1; i <= 9; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
      resto = 0;
    if (resto != parseInt(cpf.substring(9, 10)))
      return false;
    soma = 0;
    for (var i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
      resto = 0;
    if (resto != parseInt(cpf.substring(10, 11)))
      return false;
    return true;
  }

  public get showDashboard(): boolean { return ['admin', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showEmpreendedores(): boolean { return ['admin', 'Supervisor', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showMeuCadastro(): boolean { return ['admin'].indexOf(this.Perfil) !== -1; }
  public get showCadastros(): boolean { return ['admin', 'Supervisor', 'Agente de Crédito', 'Ouvidoria', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showTestesIntegracao(): boolean { return ['admin'].indexOf(this.Perfil) !== -1; }
  public get showAgentes(): boolean { return ['admin', 'Supervisor', 'Agente de Crédito', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showJurisdicoes(): boolean { return ['admin', 'Supervisor', 'Agente de Crédito', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showCeps(): boolean { return ['admin'].indexOf(this.Perfil) !== -1; }
  public get showDominios(): boolean { return ['admin'].indexOf(this.Perfil) !== -1; }
  public get showCorrecaoBasica(): boolean { return ['Ouvidoria', 'Coordenador', 'admin', 'Supervisor', 'Agente de Crédito', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showVerificar(): boolean { return ['admin', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showExcluir(): boolean { return ['admin', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showEditarCadastro(): boolean { return ['admin', 'Supervisor', 'Agente de Crédito', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showAlterarPerfil(): boolean { return ['admin', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showFaleConosco(): boolean { return ['admin', 'Ouvidoria', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showNovaJurisdicao(): boolean { return ['admin', 'Sine', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showMinhaJurisdicao(): boolean { return ['Agente de Crédito', 'admin', 'Supervisor', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showSupervisores(): boolean { return ['admin', 'Supervisor', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showResetPassword(): boolean { return ['admin', 'Supervisor', 'Ouvidoria', 'Coordenador', 'Gerente Operacinal', 'Agente de Crédito'].indexOf(this.Perfil) !== -1; }
  public get showDefinirAgente(): boolean { return ['admin', 'Supervisor', 'Coordenador', 'Gerente Operacinal'].indexOf(this.Perfil) !== -1; }
  public get showAtribuirParaMim(): boolean { return ['Agente de Crédito'].indexOf(this.Perfil) !== -1; }





  private _progress: boolean;
  public get Progress(): boolean { return this._progress || false; }
  public set Progress(value: boolean) { this._progress = value; }

  private _helper: string;
  public get helper(): string {
    return this._helper || '';
  }
  public set helper(value: string) {
    this._helper = value;
  }

  private _elegivel: boolean;
  public get Elegivel(): boolean { return this._elegivel || false; }
  public set Elegivel(value: boolean) { this._elegivel = value; }

  private _status: string;
  public get Status(): string { return this._status || ''; }
  public set Status(value: string) { this._status = value; }

  private _showHeader: boolean;
  private _UserId: number;
  public get UserId(): number {
    // if (loggar) console.log('get UserId', this._UserId);
    return this._UserId;
  }
  public set UserId(value: number) {
    // if (loggar) console.log('set UserId', value);
    this._UserId = value;
  }

  public get showHeader(): boolean { return this._showHeader || false; }
  public set showHeader(value: boolean) { this._showHeader = value; }

  private _UserName: any;
  private _UserEmail: any;
  public get UserEmail(): any { return this._UserEmail || ''; }

  public set UserEmail(value: any) { this._UserEmail = value; }
  private _UserPhone: any;
  public get UserPhone(): any { return this._UserPhone || ''; }
  public set UserPhone(value: any) { this._UserPhone = value; }
  public get UserName(): any { return this._UserName || ''; }
  public set UserName(value: any) { this._UserName = value; }

  private _perfil: string;
  private _sideBarOpen: boolean;
  public get sideBarOpen(): boolean {
    return this._sideBarOpen || false;
  }
  public set sideBarOpen(value: boolean) {
    this._sideBarOpen = value;
  }
  public get Perfil(): string {
    return this._perfil || 'Cidadão';
  }
  public set Perfil(value: string) {
    this._perfil = value;
  }

  private _token: string;
  public get token(): string {
    return this._token;
  }
  public set token(value: string) {
    this._token = value;
  }

  headers: HttpHeaders;
  constructor(
    public httpClient: HttpClient,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject("LOCALSTORAGE") private localStorage: any
  ) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set("Content-Type", "application/json");
  }


  public setHelper(texto: string) { console.log('setHelper', texto); this.helper = texto; }

  isCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    // verificando se tem a quantidade certa de caracter e se não tem todos caracteres iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf))
      return false;
    let soma = 0,
      resto;
    for (var i = 1; i <= 9; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
      resto = 0;
    if (resto != parseInt(cpf.substring(9, 10)))
      return false;
    soma = 0;
    for (var i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto == 10) || (resto == 11))
      resto = 0;
    if (resto != parseInt(cpf.substring(10, 11)))
      return false;
    return true;
  }

  getAge(dataN: any): number {
    var today = new Date();
    var birthDate = dataN; //new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  save(id: number, endpoint: string, registro: any): Observable<any> {
    if (id === 0) {
      if (loggar) console.log('post', id, endpoint, registro);
      return this.httpPost(endpoint, registro);
    } else {
      if (loggar) console.log('put', id, endpoint, registro);
      return this.httpPut(endpoint + "/" + id, registro);
    }
  }
  StringToDate(DataNascimento: any): any {
    console.log("DataNascimento", DataNascimento);
    if (DataNascimento === null)
      return DataNascimento;
    let dia = DataNascimento.toString().substring(0, 2);
    let mes = DataNascimento.toString().substring(3, 5);
    let ano = DataNascimento.toString().substring(6, 10);
    console.log("dia", dia, "mes", mes, "ano", ano);
    return new Date(ano, mes - 1, dia);
  }



  public httpGet(metodo: string, cnpj: string = ""): Observable<any> {
    //let headers = this.getHeaders();
    //if (cnpj !== "") headers = this.getHeaders("cnpj", cnpj);
    if (loggar) console.log('httpGet', environment.url + metodo);
    return this.httpClient.get(environment.url + metodo, { headers: this.getHeaders() });
  }

  public httpPost(
    metodo: string,
    body: any,
    cnpj: string = ""
  ): Observable<any> {
    let headers = this.getHeaders();
    if (cnpj !== "") headers = this.getHeaders("cnpj", cnpj);

    return this.httpClient.post(
      environment.url + metodo,
      JSON.stringify(body),
      { headers: headers }
    );
  }

  public httpPut(
    metodo: string,
    body: any,
    cnpj: string = ""
  ): Observable<any> {
    let headers = this.getHeaders();
    if (cnpj !== "") headers = this.getHeaders("cnpj", cnpj);

    if (loggar) console.log('httpPut', environment.url + metodo, JSON.stringify(body), headers);

    return this.httpClient.put(environment.url + metodo, JSON.stringify(body), {
      headers: headers,
    });
  }

  public httpDelete(metodo: string, cnpj: string = ""): Observable<any> {
    let headers = this.getHeaders();
    if (cnpj !== "") headers = this.getHeaders("cnpj", cnpj);
    return this.httpClient.delete(environment.url + metodo, {
      headers: headers,
    });
  }

  private getLocalStorage(chave: string): any { return localStorage.getItem(chave); }

  private setLocalStorage(chave: string, value: any): void { localStorage.setItem(chave, value); }

  public setStorageObject(chave: string, valor: any): any { this.localStorage.setItem(chave, JSON.stringify(valor)); }

  public getStorageObject(chave: string): any { return this.localStorage.getItem(chave); }

  private removeStorage(chave: string): any { this.localStorage.removeItem(chave); }

  getHeaders(chave: string = "", valor: string = ""): HttpHeaders {
    if (!this.headers) this.headers = new HttpHeaders();

    if (!this.headers.has("Content-Type") || this.headers.get("Content-Type") !== "application/json") //(chave === 'Content-Type' && valor === ''))
      this.headers = this.headers.set("Content-Type", "application/json");
    else if (chave === 'Content-Type' && this.headers.get(chave) !== valor)
      this.headers = this.headers.set("Content-Type", valor);

    if (!this.headers.has("Content-Type"))
      this.headers = this.headers.set("Authorization", "Basic BI-SEDET:966df1b4e9609e34cf02c9c9267e2025");


    if (chave !== "") {
      if (!this.headers.has(chave)) { this.headers = this.headers.set(chave, valor); }
      else if (this.headers.get(chave) !== valor) { this.headers = this.headers.set(chave, valor); }
    }

    // _console("getHeaders", this.headers);
    return this.headers;
  }

  public findInvalidControls(formGroup: FormGroup, msg: any[] = null): any[] {
    const invalid = [];
    const controls = formGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        let item = msg.find(x => x.key === name);
        if (item) {
          if (loggar) console.log('message', item);
          invalid.push(item.value);
        }
        else
          invalid.push(name);
      }
    }
    if (invalid.length > 0) {
      let campos = "";
      invalid.forEach((element) => {
        campos += (campos === "" ? "" : "; ") + element;
      });
      this.snackBar.open(
        "Os sequintes campos são obrigatórios: " + campos,
        "Atenção",
        { duration: 5000 }
      );
      let _dialog = this.dialog.open(DlgMessageComponent, {
        data: {
          message: invalid,
          titulo: 'Atenção '
        },
        minWidth: "50%",
        minHeight: "40%"
      });
      _dialog.afterClosed().subscribe(r => {

      });
    }
    return invalid;
  }
}
