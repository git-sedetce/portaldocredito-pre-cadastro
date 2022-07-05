import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestesIntegracaoRoutingModule } from './testes-integracao-routing.module';
import { TestesIntegracaoComponent } from './testes-integracao.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [TestesIntegracaoComponent],
  imports: [
    CommonModule,
    TestesIntegracaoRoutingModule,
    MatButtonModule,
  ]
})
export class TestesIntegracaoModule { }
