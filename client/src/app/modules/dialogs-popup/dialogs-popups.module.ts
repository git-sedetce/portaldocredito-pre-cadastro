import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtrbuirAgenteComponent } from './atrbuir-agente/atrbuir-agente.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MyPipesModule } from 'src/app/shared/pipes/pipes.module';
import { ProjectDirectivesModule } from 'src/app/shared/directives/project-directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [AtrbuirAgenteComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    ProjectDirectivesModule,
    MyPipesModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
  ]
})
export class DialogsPopupsModule { }
