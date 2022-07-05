import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phone' })
export class PhonePipe implements PipeTransform {
    // tslint:disable-next-line:typedef
    transform(value) {
        if (value !== null && value !== undefined && value.length > 0) {
            return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/g, '(\$1) \$2 \$3.\$4');
        }

    }

}
