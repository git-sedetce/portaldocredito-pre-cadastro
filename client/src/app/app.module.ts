import { BrowserModule } from "@angular/platform-browser";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatRadioModule } from "@angular/material/radio";
import { ExternalService } from "./shared/services/external.service";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ProjectDirectivesModule } from "./shared/directives/project-directives";
import { MyPipesModule } from "./shared/pipes/pipes.module";
// import { MaterialModulos } from "./material-modulos.module";
import { DefaultComponent } from "./layouts/default/default.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { SharedModule } from "./shared/shared.module";
import { DominiosComponent } from "./modules/dominios/dominios.component";
import { MatCardModule } from "@angular/material/card";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { PreCadastroConfirmacaoComponent } from "./modules/pre-cadastro-confirmacao/pre-cadastro-confirmacao.component";
import { NovaSenhaComponent } from "./modules/nova-senha/nova-senha.component";
import { TrocarSenhaComponent } from "./modules/trocar-senha/trocar-senha.component";
import { CorrecaoDadosBasicosComponent } from "./modules/correcao-dados-basicos/correcao-dados-basicos.component";
import { LoginModule } from "./modules/login/login.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { DialogsPopupsModule } from './modules/dialogs-popup/dialogs-popups.module';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    DominiosComponent,
    PreCadastroConfirmacaoComponent,
    NovaSenhaComponent,
    TrocarSenhaComponent,
    CorrecaoDadosBasicosComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BrowserModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ProjectDirectivesModule,
    MyPipesModule,
    MatFormFieldModule,
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
    MatRadioModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    LoginModule,
    DashboardModule,
    DialogsPopupsModule
  ],
  exports: [ProjectDirectivesModule,
    MyPipesModule,
    SharedModule],
  entryComponents: [PreCadastroConfirmacaoComponent,
    NovaSenhaComponent, TrocarSenhaComponent,
    CorrecaoDadosBasicosComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ExternalService,
    // { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    // { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: "LOCALSTORAGE", useFactory: getLocalStorage },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

export function getLocalStorage(): any {
  return typeof window !== "undefined" ? window.localStorage : null;
}
