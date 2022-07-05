import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CadastrosComponent } from './cadastros.component';

const routes: Routes = [{ path: '', component: CadastrosComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastrosRoutingModule { }
