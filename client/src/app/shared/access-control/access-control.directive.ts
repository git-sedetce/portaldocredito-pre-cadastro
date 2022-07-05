import { CredenciaisService } from './credenciais.service';
import { OnInit, Output } from '@angular/core';
import {
    Directive,
    ElementRef,
    Input,
} from '@angular/core';
import { ExternalService } from '../services/external.service';
import { loggar } from '../services/constantes';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[AccessControl]'
})
export class AccessControlDirective implements OnInit {
    // private group = GROUP_OPERATION_FILTER;
    public el: HTMLElement;
    constructor(
        public element: ElementRef,
        public services: ExternalService,
        private _cred: CredenciaisService
    ) {
        this.el = this.element.nativeElement;
        // if (loggar) console.log('el', this.el);

    }

    @Input() public objeto: string;
    @Input() public nivel: string;
    @Input() public rules: string[];
    @Input() public rulesSelect: string[];
    @Input() public field: string;
    @Input() public Forbidden: string[];
    @Output() public esconder: boolean;

    public hiden: boolean;

    ngOnInit(): boolean {
        this.el = this.element.nativeElement;
        this.hiden = true;
        if (this.rules === null || this.rules === undefined) {
            this.rules = [];
        }

        // if (this.rules.length > 0) {
        this.hiden = true;
        this.rules.forEach(rule => {
            //if (loggar) console.log('rule', rule, 'Perfil', this.services.Perfil, rule === this.services.Perfil);
            //if (this.hiden) {
            // this.hiden = rule !== this.services.Perfil;
            // }
            if (rule === this.services.Perfil && this.hiden) {
                // if (loggar) console.log('Controle exibido', rule, this.services.Perfil);
                // this.el.setAttribute("style", "display: nornal;");
                // return true;
                this.hiden = false;
            }

        });


        if (this.hiden) {
            //if (loggar) console.log('Controle não exibido');
            // this.el.setAttribute("style", "display: none;");
        }

        return true;
        /// Será ocultado o item se o perfil do usuário estiver na lista dos negados
        if (this.Forbidden !== undefined) {
            this.Forbidden.forEach(rule => {
                if (!this.hiden) {
                    this.hiden = rule !== this.services.Perfil;
                    //(this._cred.usuarioAutenticado.rules.indexOf(rule) >= 0);
                    try {
                        //  // _console('Porém negado para ', this.navItem.title, this._cred.usuarioAutenticado.rules);
                    } catch (error) {
                        // _console('Apenas aviso');
                    }

                }
            });
        }

        // } else {
        //     this.hiden = true;
        // }
        // if (this.hiden) {
        // this.el.parentNode.removeChild(this.el);
        //     this.el.hidden = true;
        //     return false;
        // }
        //} else {
        //    if (loggar) console.log('usuário não identificado');
        //    this.el.style.display = 'none';
        //    // this.el.parentNode.removeChild(this.el);
        //    if (loggar) console.log('el', this.el);
        //}
    }



    // ngOnChanges(changes: SimpleChanges) {
    //     if (changes.input) {

    //     }
    // }

    // @HostListener('window:keyup', ['$event'])
    // keyEvent(event: KeyboardEvent) {
    // }

    // @HostListener('window:focusout', ['$event'])
    // keyEvent(event: any) {
    //     this.checkEvent(event);
    // }

    // @HostListener('ngModelChange', ['$event'])
    // changeEvent(event: any) {
    //     this.checkEvent(event);
    // }

    // private checkEvent(event: any) {
    //     // this.el.tagName === 'MAT-SELECT'
    //     const data = !isNaN(event) || typeof event === 'string' || event instanceof String ? event : (<HTMLInputElement>this.el).value;
    //     const rule = new Rule(this.field, this.op, data);
    //     this.model.page = 1;
    //     if (!this.model.filters) {
    //         this.model.filters = new Filter(this.group.and, [rule]);
    //     } else {
    //         if (this.model.filters.groups && this.model.filters.groups.length) {
    //             this.model.filters.groups.map(f => this.checkRules(f.rules, rule));
    //         } else {
    //             this.checkRules(this.model.filters.rules, rule);
    //         }
    //     }
    // }

    // private checkRules(rules: Rule[], rule: Rule) {
    //     const criteria = (x: Rule) => x.field === rule.field && x.op === rule.op;
    //     if (!rules.some(criteria)) {
    //         rules.push(rule);
    //     } else {
    //         rules.filter(criteria).map(x => x.data = rule.data);
    //     }
    // }
}

