import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Feathers } from './feathers.service';
import { FuseUtils } from '@fuse/utils';

@Injectable()
export class PeopleService implements Resolve<any> {
  onPeopleDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  people: any;

  constructor(private feathers: Feathers) { }

  /**
   * The Cities App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getPeople()
      ]).then(
        ([files]) => {
          this.onPeopleDataChanged.subscribe(res=> console.log(res))
          resolve();
        },
        reject
      );
    });
  }

  getPeople(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.peoples$()
        .subscribe((response: any) => {
          this.people = response;
          this.onPeopleDataChanged.next(this.people);
          resolve(this.people);
        }, reject);
    }
    );
  }

  peoples$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/people'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data);
  }
}
