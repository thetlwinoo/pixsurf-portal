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

import { CustomerCategory } from './customer-categories.model';

@Injectable()
export class CustomerCategoriesService implements Resolve<any>
{
  onCustomerCategoriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCountriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedCustomerCategoriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  customerCategories: CustomerCategory[];
  authenticatedPeople: any;
  selectedCustomerCategories: string[] = [];
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
   * The CustomerCategories App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getCountries(),
        this.getCustomerCategories(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getCustomerCategories();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getCustomerCategories();
          });

          resolve();

        },
        reject
      );
    });
  }

  getCustomerCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.customerCategories$()
        .subscribe((response: any) => {

          this.customerCategories = response;

          if (this.filterBy === 'starred') {
            this.customerCategories = this.customerCategories.filter(_CustomerCategory => {
              return this.authenticatedPeople.starred.includes(_CustomerCategory.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.customerCategories = this.customerCategories.filter(_CustomerCategory => {
              return this.authenticatedPeople.frequentCustomerCategories.includes(_CustomerCategory.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.customerCategories = FuseUtils.filterArrayByString(this.customerCategories, this.searchText);
          }

          this.customerCategories = this.customerCategories.map(customerCategory => {
            return new CustomerCategory(customerCategory);
          });

          this.onCustomerCategoriesChanged.next(this.customerCategories);
          resolve(this.customerCategories);
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
   * Toggle selected CustomerCategory by id
   * @param id
   */
  toggleSelectedCustomerCategory(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedCustomerCategories.length > 0) {
      const index = this.selectedCustomerCategories.indexOf(id);

      if (index !== -1) {
        this.selectedCustomerCategories.splice(index, 1);

        // Trigger the next event
        this.onSelectedCustomerCategoriesChanged.next(this.selectedCustomerCategories);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedCustomerCategories.push(id);

    // Trigger the next event
    this.onSelectedCustomerCategoriesChanged.next(this.selectedCustomerCategories);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedCustomerCategories.length > 0) {
      this.deselectCustomerCategories();
    }
    else {
      this.selectCustomerCategories();
    }
  }

  selectCustomerCategories(filterParameter?, filterValue?) {
    this.selectedCustomerCategories = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedCustomerCategories = [];
      this.customerCategories.map(CustomerCategory => {
        this.selectedCustomerCategories.push(CustomerCategory.id);
      });
    }
    else {
      /* this.selectedCustomerCategories.push(...
           this.customerCategories.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedCustomerCategoriesChanged.next(this.selectedCustomerCategories);
  }

  addCustomerCategory(CustomerCategory) {
    CustomerCategory.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addCustomerCategory$({ ...CustomerCategory })
        .subscribe(response => {
          this.getCustomerCategories();
          resolve(response);
        });
    });
  }

  updateCustomerCategory(CustomerCategory) {
    CustomerCategory.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveCustomerCategory$(CustomerCategory.id, { ...CustomerCategory })
        .subscribe(response => {
          this.getCustomerCategories();
          resolve(response);
        });
    });
  }

  deselectCustomerCategories() {
    this.selectedCustomerCategories = [];

    // Trigger the next event
    this.onSelectedCustomerCategoriesChanged.next(this.selectedCustomerCategories);
  }

  deleteCustomerCategory(CustomerCategory) {
    this.deleteCustomerCategory$(CustomerCategory.id);
    this.getCustomerCategories();
  }

  deleteSelectedCustomerCategories() {
    for (const CustomerCategoryId of this.selectedCustomerCategories) {
      this.deleteCustomerCategory$(CustomerCategoryId);
    }
    this.getCustomerCategories(); //custom added
    this.deselectCustomerCategories();
  }

  //feathers API
  customerCategories$(): Observable<any[]> {
    return (<any>this.feathers
      .service('sales/customer-categories'))
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

  addCustomerCategory$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('sales/customer-categories')
        .create(data));
  }

  saveCustomerCategory$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('sales/customer-categories')
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

  deleteCustomerCategory$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('sales/customer-categories')
      .remove(id)
  }
  //end feathers API
}
