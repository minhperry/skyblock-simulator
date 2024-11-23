import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import DOMPurify from "dompurify";

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private domSan: DomSanitizer) {}

  transform(value: string): unknown {
    const sanitized = DOMPurify.sanitize(value)
    return this.domSan.bypassSecurityTrustHtml(sanitized)
  }

}

// https://www.intricatecloud.io/2019/10/using-angular-innerhtml-to-display-user-generated-content-without-sacrificing-security/
