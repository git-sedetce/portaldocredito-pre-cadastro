import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JurisdicaoAgentesComponent } from './jurisdicao-agentes.component';

const routes: Routes = [{ path: '', component: JurisdicaoAgentesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JurisdicaoAgentesRoutingModule { }
