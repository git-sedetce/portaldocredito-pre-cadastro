import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadastrosRoutingModule } from './cadastros-routing.module';
import { CadastrosComponent } from './cadastros.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MyPipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatInputModule } from '@angular/material/input';
import { ProjectDirectivesModule } from 'src/app/shared/directives/project-directives';
import { MatMenuModule } from '@angular/material/menu';
import { DominiosEdicaoModule } from '../dominios-edicao/dominios-edicao.module';
import { TrocePerfilModule } from '../troce-perfil/troce-perfil.module';


@NgModule({
  declarations: [CadastrosComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    CadastrosRoutingModule,
    MyPipesModule,
    MatInputModule,
    MatMenuModule,
    ProjectDirectivesModule,
    DominiosEdicaoModule,
    TrocePerfilModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CadastrosModule { }
