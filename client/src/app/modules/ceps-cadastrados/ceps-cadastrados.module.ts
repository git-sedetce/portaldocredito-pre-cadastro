import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CepsCadastradosRoutingModule } from './ceps-cadastrados-routing.module';
import { CepsCadastradosComponent } from './ceps-cadastrados.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [CepsCadastradosComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    CepsCadastradosRoutingModule
  ]
})
export class CepsCadastradosModule { }
