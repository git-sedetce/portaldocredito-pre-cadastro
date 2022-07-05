import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JurisdicaoLocaisComponent } from './jurisdcao-locais.component';

const routes: Routes = [{ path: '', component: JurisdicaoLocaisComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JurisdcaoLocaisRoutingModule { }
