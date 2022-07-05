import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JurisdicoesComponent } from './jurisdicoes.component';

const routes: Routes = [{ path: '', component: JurisdicoesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JurisdicoesRoutingModule { }
