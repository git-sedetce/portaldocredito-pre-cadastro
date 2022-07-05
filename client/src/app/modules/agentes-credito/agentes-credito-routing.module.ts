import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgentesCreditoComponent } from './agentes-credito.component';

const routes: Routes = [{ path: '', component: AgentesCreditoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentesCreditoRoutingModule { }
