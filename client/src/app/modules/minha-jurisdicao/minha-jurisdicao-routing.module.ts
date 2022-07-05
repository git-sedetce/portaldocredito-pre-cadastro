import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MinhaJurisdicaoComponent } from './minha-jurisdicao.component';

const routes: Routes = [{ path: '', component: MinhaJurisdicaoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinhaJurisdicaoRoutingModule { }
