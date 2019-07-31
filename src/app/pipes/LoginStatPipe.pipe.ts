import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'loginStat' })
export class LoginStatPipe implements PipeTransform {
  transform(obj: any, prop: string): any {
    return obj[prop];
  }
}