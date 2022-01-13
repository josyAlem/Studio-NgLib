import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studioUiFilterPipe'
})
export class StudioUiFilterPipe implements PipeTransform {

  transform(items: any[], callback: (item: any) => boolean): any {
    if (!items || !callback) {
      return items;
    }

    return items.filter(itm => callback(itm));
  }

}
