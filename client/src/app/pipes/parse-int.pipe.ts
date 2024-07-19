import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseInt',
  pure: true,
  standalone: true
})
export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    return parseInt(value, 10);
  }
}