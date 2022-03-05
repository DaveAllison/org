import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'qr',
  pure: false
})
export class QrPipe implements PipeTransform {

  transform(controls: any[]){
    return controls.filter(control => control.qr)
  }

}

