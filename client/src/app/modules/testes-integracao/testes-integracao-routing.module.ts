import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestesIntegracaoComponent } from './testes-integracao.component';

const routes: Routes = [{ path: '', component: TestesIntegracaoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestesIntegracaoRoutingModule { }
