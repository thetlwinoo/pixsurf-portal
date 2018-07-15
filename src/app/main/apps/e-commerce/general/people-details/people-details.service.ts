import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { PxDataService } from '@fuse/services/partials/data.service';
import { Feathers } from '@fuse/services/partials/feathers.service';

// import { Store, select } from '@ngrx/store';
// import * as fromAuth from '@fuse/ngrx/auth/reducers';
// import * as Auth from '@fuse/ngrx/auth/actions/auth';
// import { User } from '@fuse/ngrx/auth/models';
import { PeopleService } from '@fuse/services/partials/people.service';

@Injectable()
export class EcommercePeopleDetailsService {

  routeParams: any;
  people: any;
  newId: string;
  languages: any;
  authenticatedPeople: any;
  auth$: any;

  onPeopleChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onLanguageChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    // private store: Store<fromAuth.State>,
    private http: HttpClient,
    private feathers: Feathers,
    private authPeople: PeopleService
  ) {
    // this.auth$ = this.store.pipe(select(fromAuth.getAuthenticatedPeople));
  }

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    this.routeParams = route.params;

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getLanguages(),
        this.getPeople(),
        this.getAuthenticatedPeople()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getPeople(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onPeopleChanged.next(false);
        resolve(false);
      }
      else {
        this.people$(this.routeParams.id)
          .subscribe((response: any) => {
            this.people = response;
            this.onPeopleChanged.next(this.people);
            resolve(response);
          }, reject);
      }
    });
  }

  getLanguages(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.languages$()
        .subscribe((response: any) => {

          this.languages = response;

          this.onLanguageChanged.next(this.languages);
          resolve(this.languages);
        }, reject);
    }
    );
  }

  getAuthenticatedPeople(): Promise<any> {
    // return new Promise((resolve, reject) => {
    //   this.auth$
    //     .subscribe((response: any) => {
    //       this.authenticatedPeople = response;
    //       this.onUserDataChanged.next(this.authenticatedPeople);
    //       resolve(this.authenticatedPeople);
    //     }, reject);
    // }
    // );
    return new Promise((resolve, reject) => {
      this.authPeople.onPeopleDataChanged
        .subscribe((response: any) => {
          this.authenticatedPeople = response;
          this.onUserDataChanged.next(this.authenticatedPeople);
          resolve(this.authenticatedPeople);
        }, reject);
    }
    );
  }

  savePeople(people) {
    people.lastEditedBy = this.authenticatedPeople._id;
    if (people.userPreferences) {
      people.userPreferences = JSON.parse(people.userPreferences);
    }
    return new Promise((resolve, reject) => {
      this.savePeople$(people.id, people)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  addPeople(people) {
    people.lastEditedBy = this.authenticatedPeople._id;
    if (people.userPreferences) {
      people.userPreferences = JSON.parse(people.userPreferences);
    }
    return new Promise((resolve, reject) => {
      this.addPeople$(people)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  //feathers API
  people$(id): Observable<any> {
    return (<any>this.feathers
      .service('general/people'))
      .watch()
      .get(id);
  }

  languages$(): Observable<any> {
    return (<any>this.feathers
      .service('general/languages'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data);
  }

  savePeople$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('general/people')
      .update(id, data));
  }

  addPeople$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('general/people')
        .create(data)
        .then(res => res));
  }
  //end feathers API

}
