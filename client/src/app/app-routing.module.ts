import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DefaultComponent } from "./layouts/default/default.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";
import { DominiosComponent } from "./modules/dominios/dominios.component";
import { LoginComponent } from "./modules/login/login.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "dominios", component: DominiosComponent },
      { path: "dashboard", component: DashboardComponent },
      { path: 'cadastros', loadChildren: () => import('./modules/cadastros/cadastros.module').then(m => m.CadastrosModule) },
      { path: 'cadastros/:id', loadChildren: () => import('./modules/cadastros/cadastros.module').then(m => m.CadastrosModule) },
      { path: 'agentes/:id', loadChildren: () => import('./modules/cadastros/cadastros.module').then(m => m.CadastrosModule) },
      { path: 'supervisores/:id', loadChildren: () => import('./modules/cadastros/cadastros.module').then(m => m.CadastrosModule) },
      { path: 'testes-integracao', loadChildren: () => import('./modules/testes-integracao/testes-integracao.module').then(m => m.TestesIntegracaoModule) },
      { path: 'ceps-cadastrados', loadChildren: () => import('./modules/ceps-cadastrados/ceps-cadastrados.module').then(m => m.CepsCadastradosModule) },
      { path: 'cadastro-usuario/:id', loadChildren: () => import('./modules/cadastro/cadastro-usuario.module').then(m => m.CadastroUserModule) },
      { path: 'agentes-credito', loadChildren: () => import('./modules/agentes-credito/agentes-credito.module').then(m => m.AgentesCreditoModule) },
      { path: 'pos-cadastro', loadChildren: () => import('./modules/pos-cadastro/pos-cadastro.module').then(m => m.PosCadastroModule) },
      { path: 'jurisdicoes', loadChildren: () => import('./modules/jurisdicoes/jurisdicoes.module').then(m => m.JurisdicoesModule) },
      { path: 'pre-cadastro', loadChildren: () => import('./modules/pre-cadastro/pre-cadastro.module').then(m => m.PreCadastroModule) },
      { path: 'fale-conosco', loadChildren: () => import('./modules/fale-conosco/fale-conosco.module').then(m => m.FaleConoscoModule) },
      { path: 'fale-conosco-list', loadChildren: () => import('./modules/fale-conosco-list/fale-conosco-list.module').then(m => m.FaleConoscoListModule) },
      { path: 'jurisdicao-locais/:id', loadChildren: () => import('./modules/jurisdcao-locais/jurisdcao-locais.module').then(m => m.JurisdcaoLocaisModule) },
      { path: 'jurisdicao-agentes/:id', loadChildren: () => import('./modules/jurisdicao-agentes/jurisdicao-agentes.module').then(m => m.JurisdicaoAgentesModule) },
      { path: 'minha-jurisdicao', loadChildren: () => import('./modules/minha-jurisdicao/minha-jurisdicao.module').then(m => m.MinhaJurisdicaoModule) },
    ],
  },
  { path: 'agentes-credito', loadChildren: () => import('./modules/agentes-credito/agentes-credito.module').then(m => m.AgentesCreditoModule) },
  { path: 'pos-cadastro', loadChildren: () => import('./modules/pos-cadastro/pos-cadastro.module').then(m => m.PosCadastroModule) },
  { path: 'jurisdicoes', loadChildren: () => import('./modules/jurisdicoes/jurisdicoes.module').then(m => m.JurisdicoesModule) },
  { path: 'fale-conosco-list', loadChildren: () => import('./modules/fale-conosco-list/fale-conosco-list.module').then(m => m.FaleConoscoListModule) },





  /*{ path: "login", component: PreCadastroComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "cadastro-usuario/:id", component: CadastroUserComponent },
  {
    path: "dominios",
    component: DominiosComponent
  },
  { path: 'cadastros', loadChildren: () => import('./modules/cadastros/cadastros.module').then(m => m.CadastrosModule) },
  { path: 'testes-integracao', loadChildren: () => import('./modules/testes-integracao/testes-integracao.module').then(m => m.TestesIntegracaoModule) },
  { path: 'ceps-cadastrados', loadChildren: () => import('./modules/ceps-cadastrados/ceps-cadastrados.module').then(m => m.CepsCadastradosModule) },
*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
