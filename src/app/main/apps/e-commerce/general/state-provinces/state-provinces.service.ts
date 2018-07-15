import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Feathers } from '@fuse/services/partials/feathers.service';
import { FuseUtils } from '@fuse/utils';

// import { Store, select } from '@ngrx/store';
// import * as fromAuth from '@fuse/ngrx/auth/reducers';
// import * as Auth from '@fuse/ngrx/auth/actions/auth';
// import { User } from '@fuse/ngrx/auth/models';
import { PeopleService } from '@fuse/services/partials/people.service';

import { StateProvince } from './state-provinces.model';

@Injectable()
export class StateProvincesService implements Resolve<any>
{
  onStateProvincesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCountriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedStateProvincesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  stateProvinces: StateProvince[];
  authenticatedPeople: any;
  selectedStateProvinces: string[] = [];
  auth$: any;
  countries: any;
  searchText: string;
  filterBy: string;

  constructor(
    // private store: Store<fromAuth.State>,
    private http: HttpClient,
    private feathers: Feathers,
    private people: PeopleService
  ) {
    // this.auth$ = this.store.pipe(select(fromAuth.getAuthenticatedPeople));
  }

  /**
   * The StateProvinces App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getCountries(),
        this.getStateProvinces(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getStateProvinces();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getStateProvinces();
          });

          resolve();

        },
        reject
      );
    });
  }

  getStateProvinces(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stateProvinces$()
        .subscribe((response: any) => {

          this.stateProvinces = response;

          if (this.filterBy === 'starred') {
            this.stateProvinces = this.stateProvinces.filter(_StateProvince => {
              return this.authenticatedPeople.starred.includes(_StateProvince.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.stateProvinces = this.stateProvinces.filter(_StateProvince => {
              return this.authenticatedPeople.frequentStateProvinces.includes(_StateProvince.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.stateProvinces = FuseUtils.filterArrayByString(this.stateProvinces, this.searchText);
          }

          this.stateProvinces = this.stateProvinces.map(stateProvince => {
            return new StateProvince(stateProvince);
          });

          this.onStateProvincesChanged.next(this.stateProvinces);
          resolve(this.stateProvinces);
        }, reject);
    }
    );
  }

  getCountries(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.countries$()
        .subscribe((response: any) => {

          this.countries = response;
          
          this.onCountriesChanged.next(this.countries);
          resolve(this.countries);
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
      this.people.onPeopleDataChanged
        .subscribe((response: any) => {
          this.authenticatedPeople = response;
          this.onUserDataChanged.next(this.authenticatedPeople);
          resolve(this.authenticatedPeople);
        }, reject);
    }
    );
  }

  /**
   * Toggle selected StateProvince by id
   * @param id
   */
  toggleSelectedStateProvince(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedStateProvinces.length > 0) {
      const index = this.selectedStateProvinces.indexOf(id);

      if (index !== -1) {
        this.selectedStateProvinces.splice(index, 1);

        // Trigger the next event
        this.onSelectedStateProvincesChanged.next(this.selectedStateProvinces);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedStateProvinces.push(id);

    // Trigger the next event
    this.onSelectedStateProvincesChanged.next(this.selectedStateProvinces);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedStateProvinces.length > 0) {
      this.deselectStateProvinces();
    }
    else {
      this.selectStateProvinces();
    }
  }

  selectStateProvinces(filterParameter?, filterValue?) {
    this.selectedStateProvinces = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedStateProvinces = [];
      this.stateProvinces.map(StateProvince => {
        this.selectedStateProvinces.push(StateProvince.id);
      });
    }
    else {
      /* this.selectedStateProvinces.push(...
           this.stateProvinces.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedStateProvincesChanged.next(this.selectedStateProvinces);
  }

  addStateProvince(StateProvince) {
    StateProvince.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addStateProvince$({ ...StateProvince })
        .subscribe(response => {
          this.getStateProvinces();
          resolve(response);
        });
    });
  }

  updateStateProvince(StateProvince) {
    StateProvince.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveStateProvince$(StateProvince.id, { ...StateProvince })
        .subscribe(response => {
          this.getStateProvinces();
          resolve(response);
        });
    });
  }

  deselectStateProvinces() {
    this.selectedStateProvinces = [];

    // Trigger the next event
    this.onSelectedStateProvincesChanged.next(this.selectedStateProvinces);
  }

  deleteStateProvince(StateProvince) {
    this.deleteStateProvince$(StateProvince.id);
    this.getStateProvinces();
  }

  deleteSelectedStateProvinces() {
    for (const StateProvinceId of this.selectedStateProvinces) {
      this.deleteStateProvince$(StateProvinceId);
    }
    this.getStateProvinces(); //custom added
    this.deselectStateProvinces();
  }

  //feathers API
  stateProvinces$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/state-provinces'))
      .watch()
      .find()
      .map(d => d.data);
  }

  countries$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/countries'))
      .watch()
      .find()
      .map(d => d.data);
  }

  addStateProvince$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('general/state-provinces')
        .create(data));
  }

  saveStateProvince$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('general/state-provinces')
      .update(id, data));
  }

  users$(): Observable<any[]> {
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

  deleteStateProvince$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('general/state-provinces')
      .remove(id)
  }
  //end feathers API
}
