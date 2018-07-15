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

import { City } from './city.model';

@Injectable()
export class CitiesService implements Resolve<any>
{
  onCitiesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onStateProvincesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedCitiesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  cities: City[];
  stateProvinces: any;
  authenticatedPeople: any;
  selectedCities: string[] = [];
  auth$: any;

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
   * The Cities App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getCities(),
        this.getStateProvinces(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getCities();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getCities();
          });

          resolve();

        },
        reject
      );
    });
  }

  getCities(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cities$()
        .subscribe((response: any) => {

          this.cities = response;

          if (this.filterBy === 'starred') {
            this.cities = this.cities.filter(_city => {
              return this.authenticatedPeople.starred.includes(_city.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.cities = this.cities.filter(_city => {
              return this.authenticatedPeople.frequentCities.includes(_city.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.cities = FuseUtils.filterArrayByString(this.cities, this.searchText);
          }

          this.cities = this.cities.map(city => {
            return new City(city);
          });

          this.onCitiesChanged.next(this.cities);
          resolve(this.cities);
        }, reject);
    }
    );
  }

  getStateProvinces(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stateProvinces$()
        .subscribe((response: any) => {

          this.stateProvinces = response;
          
          this.onStateProvincesChanged.next(this.stateProvinces);
          resolve(this.stateProvinces);
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
   * Toggle selected city by id
   * @param id
   */
  toggleSelectedCity(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedCities.length > 0) {
      const index = this.selectedCities.indexOf(id);

      if (index !== -1) {
        this.selectedCities.splice(index, 1);

        // Trigger the next event
        this.onSelectedCitiesChanged.next(this.selectedCities);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedCities.push(id);

    // Trigger the next event
    this.onSelectedCitiesChanged.next(this.selectedCities);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedCities.length > 0) {
      this.deselectCities();
    }
    else {
      this.selectCities();
    }
  }

  selectCities(filterParameter?, filterValue?) {
    this.selectedCities = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedCities = [];
      this.cities.map(city => {
        this.selectedCities.push(city.id);
      });
    }
    else {
      /* this.selectedCities.push(...
           this.cities.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedCitiesChanged.next(this.selectedCities);
  }

  addCity(city) {
    city.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addCity$({ ...city })
        .subscribe(response => {
          this.getCities();
          resolve(response);
        });
    });
  }

  updateCity(city) {
    city.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveCity$(city.id, { ...city })
        .subscribe(response => {
          this.getCities();
          resolve(response);
        });
    });
  }

  deselectCities() {
    this.selectedCities = [];

    // Trigger the next event
    this.onSelectedCitiesChanged.next(this.selectedCities);
  }

  deleteCity(city) {
    this.deleteCity$(city.id);
    this.getCities();
  }

  deleteSelectedCities() {
    for (const cityId of this.selectedCities) {
      this.deleteCity$(cityId);
    }
    this.getCities(); //custom added
    this.deselectCities();
  }

  //feathers API
  cities$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/cities'))
      .watch()
      .find()
      .map(d => d.data);
  }

  stateProvinces$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/state-provinces'))
      .watch()
      .find()
      .map(d => d.data);
  }

  addCity$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('general/cities')
        .create(data));
  }

  saveCity$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('general/cities')
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

  deleteCity$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('general/cities')
      .remove(id)
  }
  //end feathers API
}
