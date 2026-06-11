import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'LeaveTypeVisibility'
})
export class LeaveTypeVisibilityPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
