import { Pipe, PipeTransform } from '@angular/core';
import { ColorCodes } from '../interfaces/color';

@Pipe({
  name: 'colorize'
})
export class ColorizePipe implements PipeTransform {

  transform(str: string): string {
    for (const [key, value] of Object.entries(ColorCodes)) {
      str = str.replace(new RegExp(key, 'g'), value);
    }
    return str;
  }

}
