import { Pipe, PipeTransform } from '@angular/core';
import {autoToHTML as parse} from "@sfirew/minecraft-motd-parser";

@Pipe({
  name: 'parse'
})
export class ParseMCPipe implements PipeTransform {

  transform(value: string): string {
    return parse(value)
  }

}
