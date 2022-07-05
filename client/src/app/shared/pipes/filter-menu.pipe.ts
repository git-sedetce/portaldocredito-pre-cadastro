import { Pipe, PipeTransform } from '@angular/core';
import { CredenciaisService } from '../access-control/credenciais.service';

@Pipe({
    name: 'filterMenu',
    pure: false
})
export class FilterMenuPipe implements PipeTransform {
    retorno: any[];
    constructor(private _cred: CredenciaisService) {
        this.retorno = [];
    }
    transform(items: any[]): any {
        if (!items) {
            return items;
        } else {
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        if (this._cred.usuarioAutenticado.rules.length === 0) {
            return [];
        }
        const filter = this._cred.usuarioAutenticado.rules[0];
        try {
            this.retorno = items.filter(item => item.rules.indexOf(filter) !== -1);
        } catch (error) {
        }

        // }

        this.retorno = items;
        return this.retorno;
    }
}