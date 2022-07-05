import { Directive, HostListener } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector: "[formControlName][appHHMMMask]",
})
export class HHMMMaskDirective {
    constructor(public ngControl: NgControl) { }

    @HostListener("ngModelChange", ["$event"])
    onModelChange(event) {
        this.onInputChange(event, false);
    }

    @HostListener("keydown.backspace", ["$event"])
    keydownBackspace(event) {
        this.onInputChange(event.target.value, true);
    }

    onInputChange(event, backspace) {
        let newVal = event.replace(/\D/g, "");
        if (
            // backspace &&
            newVal.length >= 5
        ) {
            newVal = newVal.substring(0, newVal.length - 1);
        }
        if (newVal.length === 0) {
            newVal = "";
        } else if (newVal.length <= 2) {
            newVal = newVal.replace(/^(\d{0,2})/, "$1");
        } else {
            //if (newVal.length <= 5) {
            newVal = newVal.replace(/^(\d{0,2})(\d{0,2})/, "$1:$2");
        }
        this.ngControl.valueAccessor.writeValue(newVal);
    }
}

