import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaleConoscoComponent } from './fale-conosco.component';

const routes: Routes = [{ path: '', component: FaleConoscoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaleConoscoRoutingModule { }
