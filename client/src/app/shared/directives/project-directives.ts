import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AccessControlDirective } from "../access-control/access-control.directive";
import { CredenciaisService } from "../access-control/credenciais.service";
import { CPFMaskDirective } from "../date-mask/app-cpf-mask";
import { DateMaskDirective } from "../date-mask/app-date-mask";
import { HHMMMaskDirective } from "../date-mask/app-hhmm-mask";
import { PhoneMaskDirective } from "../date-mask/app-phone-mask";
import { HideMeDirective } from "../hideme";
import { KzMaskDirective } from "../kzmask/kz-mask.directive";
import { UsdOnlyDirective } from "./usd-only";

@NgModule({
  declarations: [
    KzMaskDirective,
    AccessControlDirective,
    PhoneMaskDirective,
    DateMaskDirective,
    HideMeDirective,
    CPFMaskDirective,
    HHMMMaskDirective,
    UsdOnlyDirective
  ],
  imports: [],
  exports: [
    KzMaskDirective,
    AccessControlDirective,
    PhoneMaskDirective,
    DateMaskDirective,
    HideMeDirective,
    CPFMaskDirective,
    HHMMMaskDirective,
    UsdOnlyDirective
  ],
  providers: [CredenciaisService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProjectDirectivesModule {}
