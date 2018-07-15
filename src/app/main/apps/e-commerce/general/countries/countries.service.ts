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

import { Country } from './country.model';

@Injectable()
export class CountriesService implements Resolve<any>
{
  onCountriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedCountriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  countries: Country[];
  authenticatedPeople: any;
  selectedCountries: string[] = [];
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
   * The Countries App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getCountries(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getCountries();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getCountries();
          });

          resolve();

        },
        reject
      );
    });
  }

  getCountries(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.countries$()
        .subscribe((response: any) => {

          this.countries = response;

          if (this.filterBy === 'starred') {
            this.countries = this.countries.filter(_country => {
              return this.authenticatedPeople.starred.includes(_country.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.countries = this.countries.filter(_country => {
              return this.authenticatedPeople.frequentCountries.includes(_country.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.countries = FuseUtils.filterArrayByString(this.countries, this.searchText);
          }

          this.countries = this.countries.map(country => {
            return new Country(country);
          });

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
   * Toggle selected country by id
   * @param id
   */
  toggleSelectedCountry(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedCountries.length > 0) {
      const index = this.selectedCountries.indexOf(id);

      if (index !== -1) {
        this.selectedCountries.splice(index, 1);

        // Trigger the next event
        this.onSelectedCountriesChanged.next(this.selectedCountries);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedCountries.push(id);

    // Trigger the next event
    this.onSelectedCountriesChanged.next(this.selectedCountries);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedCountries.length > 0) {
      this.deselectCountries();
    }
    else {
      this.selectCountries();
    }
  }

  selectCountries(filterParameter?, filterValue?) {
    this.selectedCountries = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedCountries = [];
      this.countries.map(country => {
        this.selectedCountries.push(country.id);
      });
    }
    else {
      /* this.selectedCountries.push(...
           this.countries.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedCountriesChanged.next(this.selectedCountries);
  }

  addCountry(country) {
    country.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addCountry$({ ...country })
        .subscribe(response => {          
          resolve(response);
          this.getCountries();
        });
    });
  }

  updateCountry(country) {
    country.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveCountry$(country.id, { ...country })
        .subscribe(response => {         
          resolve(response);
          this.getCountries();
        });
    });
  }

  deselectCountries() {
    this.selectedCountries = [];

    // Trigger the next event
    this.onSelectedCountriesChanged.next(this.selectedCountries);
  }

  deleteCountry(country) {
    this.deleteCountry$(country.id);
    this.getCountries();
  }

  deleteSelectedCountries() {
    for (const countryId of this.selectedCountries) {
      this.deleteCountry$(countryId);
    }
    this.getCountries(); //custom added
    this.deselectCountries();
  }

  //feathers API
  countries$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/countries'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25,
          $populate: ['lastEditedBy']
        },        
      })
      .map(d => d.data);
  }

  addCountry$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('general/countries')
        .create(data));
  }

  saveCountry$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('general/countries')
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

  deleteCountry$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('general/countries')
      .remove(id)
  }
  //end feathers API
}
