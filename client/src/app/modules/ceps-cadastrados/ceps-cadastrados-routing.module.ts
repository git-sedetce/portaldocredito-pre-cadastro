import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CepsCadastradosComponent } from './ceps-cadastrados.component';

const routes: Routes = [{ path: '', component: CepsCadastradosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CepsCadastradosRoutingModule { }
