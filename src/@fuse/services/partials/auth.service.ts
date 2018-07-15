import { Feathers } from './feathers.service';
import { PxDataService } from './data.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { User } from '@fuse/ngrx/auth/models';
/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class AuthService {

  constructor(
    private feathers: Feathers,
    private data: PxDataService,
    private router: Router
  ) { }

  public authenticate(credentials?): Promise<any> {
    return this.feathers.authenticate(credentials);
  }

  public logIn(credentials?): Observable<any> {
    return Observable.fromPromise(
      this.authenticate(credentials)
    );
  }

  peoples$(email): Observable<any> {
    return (<any>this.feathers
      .service('general/people'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data[0]);
  }

  public logOut() {
    this.feathers.logout();
    this.router.navigate(['/auth/login']);
  }
}
