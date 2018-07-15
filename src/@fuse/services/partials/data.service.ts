import { Injectable } from '@angular/core';
import { Feathers } from './feathers.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PxDataService {

  constructor(private feathers: Feathers) { }

  people$(email): Promise<any> {    
    return (<any>this.feathers
      .service('general/people'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data)
  }
}
