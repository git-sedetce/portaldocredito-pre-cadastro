import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreCadastroComponent } from './pre-cadastro.component';

const routes: Routes = [{ path: '', component: PreCadastroComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreCadastroRoutingModule { }
