import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosCadastroRoutingModule } from './pos-cadastro-routing.module';
import { PosCadastroComponent } from './pos-cadastro.component';


@NgModule({
  declarations: [PosCadastroComponent],
  imports: [
    CommonModule,
    PosCadastroRoutingModule
  ]
})
export class PosCadastroModule { }
