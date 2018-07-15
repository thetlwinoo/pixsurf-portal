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

import { DeliveryMethod } from './delivery-methods.model';

@Injectable()
export class DeliveryMethodsService implements Resolve<any>
{
  onDeliveryMethodsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCountriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedDeliveryMethodsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  deliveryMethods: DeliveryMethod[];
  authenticatedPeople: any;
  selectedDeliveryMethods: string[] = [];
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
   * The DeliveryMethods App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getCountries(),
        this.getDeliveryMethods(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getDeliveryMethods();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getDeliveryMethods();
          });

          resolve();

        },
        reject
      );
    });
  }

  getDeliveryMethods(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.deliveryMethods$()
        .subscribe((response: any) => {

          this.deliveryMethods = response;

          if (this.filterBy === 'starred') {
            this.deliveryMethods = this.deliveryMethods.filter(_DeliveryMethod => {
              return this.authenticatedPeople.starred.includes(_DeliveryMethod.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.deliveryMethods = this.deliveryMethods.filter(_DeliveryMethod => {
              return this.authenticatedPeople.frequentDeliveryMethods.includes(_DeliveryMethod.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.deliveryMethods = FuseUtils.filterArrayByString(this.deliveryMethods, this.searchText);
          }

          this.deliveryMethods = this.deliveryMethods.map(deliveryMethod => {
            return new DeliveryMethod(deliveryMethod);
          });

          this.onDeliveryMethodsChanged.next(this.deliveryMethods);
          resolve(this.deliveryMethods);
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
   * Toggle selected DeliveryMethod by id
   * @param id
   */
  toggleSelectedDeliveryMethod(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedDeliveryMethods.length > 0) {
      const index = this.selectedDeliveryMethods.indexOf(id);

      if (index !== -1) {
        this.selectedDeliveryMethods.splice(index, 1);

        // Trigger the next event
        this.onSelectedDeliveryMethodsChanged.next(this.selectedDeliveryMethods);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedDeliveryMethods.push(id);

    // Trigger the next event
    this.onSelectedDeliveryMethodsChanged.next(this.selectedDeliveryMethods);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedDeliveryMethods.length > 0) {
      this.deselectDeliveryMethods();
    }
    else {
      this.selectDeliveryMethods();
    }
  }

  selectDeliveryMethods(filterParameter?, filterValue?) {
    this.selectedDeliveryMethods = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedDeliveryMethods = [];
      this.deliveryMethods.map(DeliveryMethod => {
        this.selectedDeliveryMethods.push(DeliveryMethod.id);
      });
    }
    else {
      /* this.selectedDeliveryMethods.push(...
           this.deliveryMethods.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedDeliveryMethodsChanged.next(this.selectedDeliveryMethods);
  }

  addDeliveryMethod(DeliveryMethod) {
    DeliveryMethod.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addDeliveryMethod$({ ...DeliveryMethod })
        .subscribe(response => {
          this.getDeliveryMethods();
          resolve(response);
        });
    });
  }

  updateDeliveryMethod(DeliveryMethod) {
    DeliveryMethod.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveDeliveryMethod$(DeliveryMethod.id, { ...DeliveryMethod })
        .subscribe(response => {
          this.getDeliveryMethods();
          resolve(response);
        });
    });
  }

  deselectDeliveryMethods() {
    this.selectedDeliveryMethods = [];

    // Trigger the next event
    this.onSelectedDeliveryMethodsChanged.next(this.selectedDeliveryMethods);
  }

  deleteDeliveryMethod(DeliveryMethod) {
    this.deleteDeliveryMethod$(DeliveryMethod.id);
    this.getDeliveryMethods();
  }

  deleteSelectedDeliveryMethods() {
    for (const DeliveryMethodId of this.selectedDeliveryMethods) {
      this.deleteDeliveryMethod$(DeliveryMethodId);
    }
    this.getDeliveryMethods(); //custom added
    this.deselectDeliveryMethods();
  }

  //feathers API
  deliveryMethods$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/delivery-methods'))
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

  addDeliveryMethod$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('general/delivery-methods')
        .create(data));
  }

  saveDeliveryMethod$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('general/delivery-methods')
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

  deleteDeliveryMethod$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('general/delivery-methods')
      .remove(id)
  }
  //end feathers API
}
