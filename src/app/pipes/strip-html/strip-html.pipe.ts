import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    const div = document.createElement('div');
    div.innerHTML = value;
    return div.textContent || '';
  }
}
