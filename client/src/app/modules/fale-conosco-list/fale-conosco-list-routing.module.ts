import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FaleConoscoListComponent } from './fale-conosco-list.component';

const routes: Routes = [{ path: '', component: FaleConoscoListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaleConoscoListRoutingModule { }
