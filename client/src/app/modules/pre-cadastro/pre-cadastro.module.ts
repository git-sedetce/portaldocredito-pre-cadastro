import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreCadastroRoutingModule } from './pre-cadastro-routing.module';
import { PreCadastroComponent } from './pre-cadastro.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyPipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ProjectDirectivesModule } from 'src/app/shared/directives/project-directives';


@NgModule({
  declarations: [PreCadastroComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    PreCadastroRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MyPipesModule,
    ProjectDirectivesModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatRadioModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule
  ]
})
export class PreCadastroModule { }
