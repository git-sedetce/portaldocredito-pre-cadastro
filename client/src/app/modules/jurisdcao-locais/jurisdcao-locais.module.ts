import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JurisdcaoLocaisRoutingModule } from './jurisdcao-locais-routing.module';
import { JurisdicaoLocaisComponent } from './jurisdcao-locais.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProjectDirectivesModule } from 'src/app/shared/directives/project-directives';
import { MyPipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [JurisdicaoLocaisComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ProjectDirectivesModule,
    MyPipesModule,
    MatSelectModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressBarModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    JurisdcaoLocaisRoutingModule
  ]
})
export class JurisdcaoLocaisModule { }
