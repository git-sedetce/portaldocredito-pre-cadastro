import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosCadastroComponent } from './pos-cadastro.component';

const routes: Routes = [{ path: '', component: PosCadastroComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosCadastroRoutingModule { }
