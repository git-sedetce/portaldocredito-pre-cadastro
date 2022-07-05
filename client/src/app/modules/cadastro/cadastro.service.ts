import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ExternalService } from 'src/app/shared/services/external.service';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(private service: ExternalService) { }

  consultarSSP(nome: string, nomeMae: string, nascimento: string, rg: string): Observable<any> {
    let url = 'http://apps3.sspds.ce.gov.br/wsAtestadoAntecedentes/service/isFichaLimpa';
    return this.service.httpClient.get(`${url}?nome=${nome}&mae=${nomeMae}&dataNascimento=${nascimento}&rg=${rg}`, { headers: this.service.getHeaders() });
  }

  consultarJUCEC(): Observable<any> {
    let urlToken = '';
    let url = "http://189.90.163.25:8090/oauth/token";
    let token = null;
    let header = this.service.getHeaders('Content-Type', 'application/x-www-form-urlencoded');
    header = this.service.getHeaders('Authorization', 'Basic YXBpOkBBcGlfYXB0YXJlIUAj');

    return this.service.httpClient.post(url, { headers: header });
    //HttpClient httpclient = HttpClients.createDefault();
    //HttpPost method = new HttpPost(url);
    //method.setHeader("Content-Type", "application/x-www-form-urlencoded");
    //method.setHeader("Authorization", "Basic YXBpOkBBcGlfYXB0YXJlIUAj");
    /**
     *  String params = "client=api&username=user_empresa&password=@Sedet_aptare!@#&grant_type=password";
         StringEntity stringEntity = new StringEntity(params);
         method.setEntity(stringEntity);

         HttpResponse httpResponse = httpclient.execute(method);
         String body = EntityUtils.toString(httpResponse.getEntity());
         
         JsonObject jobj = new Gson().fromJson(body, JsonObject.class);
         token = jobj.get("access_token").getAsString();

         String urlJucec = "http://189.90.163.25:8090/api/servico-empresa/cnpj/" + cnpj;
         
         HttpClient httpclientJucec = HttpClients.createDefault();
         HttpGet httpGetJucec = new HttpGet(urlJucec);
         httpGetJucec.setHeader("Authorization", "bearer " + token);
         
         HttpResponse httpResponseJucec = httpclientJucec.execute(httpGetJucec);
     */
  }

}
