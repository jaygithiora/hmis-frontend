import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitWords'
})
export class LimitWordsPipe implements PipeTransform {

  transform(value: string, wordLimit: number = 5): string {
    if (!value) return '';

    const words = value.split(' ');

    if (words.length <= wordLimit) {
      return value;
    }

    return words.slice(0, wordLimit).join(' ') + '...';
  }
}
