import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentesCreditoRoutingModule } from './agentes-credito-routing.module';
import { AgentesCreditoComponent } from './agentes-credito.component';


@NgModule({
  declarations: [AgentesCreditoComponent],
  imports: [
    CommonModule,
    AgentesCreditoRoutingModule
  ]
})
export class AgentesCreditoModule { }
