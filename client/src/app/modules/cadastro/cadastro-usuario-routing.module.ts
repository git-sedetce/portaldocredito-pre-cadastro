import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastroUserComponent } from './cadastro-usuario.component';

const routes: Routes = [{ path: '', component: CadastroUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastroUserRoutingModule { }
