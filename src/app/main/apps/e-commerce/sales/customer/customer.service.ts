import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { PxDataService } from '../../../../../services/data.service';
import { Feathers } from '@fuse/services/partials/feathers.service';

import { Customer } from './customer.model';
// import { Store, select } from '@ngrx/store';
// import * as fromAuth from '@fuse/ngrx/auth/reducers';
// import * as Auth from '@fuse/ngrx/auth/actions/auth';
// import { User } from '@fuse/ngrx/auth/models';
import { PeopleService } from '@fuse/services/partials/people.service';

@Injectable()
export class EcommerceCustomerService implements Resolve<any>
{
  routeParams: any;
  newId: string;

  customer: Customer;
  authenticatedPeople: any;
  customerCategories: any;
  persons: any;
  buyingGroups: any;
  deliveryMethods: any;
  addresses: any;
  auth$: any;

  onCustomerChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCustomerCategoriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onPersonChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onBuyingGroupChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onAddressChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onDeliveryMethodsChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    // private store: Store<fromAuth.State>,
    private http: HttpClient,
    private feathers: Feathers,
    private people: PeopleService
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
        this.getCustomer(),
        this.getCustomerCategories(),
        this.getPersons(),
        this.getBuyingGroups(),
        this.getDeliveryMethods(),
        this.getAddresses(),
        this.getAuthenticatedPeople()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getCustomer(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onCustomerChanged.next(false);
        resolve(false);
      }
      else {
        this.customer$(this.routeParams.id)
          .subscribe((response: any) => {
            this.customer = response;
            this.onCustomerChanged.next(this.customer);
            resolve(response);
          }, reject);
      }
    });
  }

  saveCustomer(customer) {
    customer.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.saveCustomer$(customer.id, customer)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  addCustomer(customer) {
    customer.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addCustomer$(customer)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
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

  getCustomerCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.customerCategories$()
        .subscribe((response: any) => {

          this.customerCategories = response;

          this.onCustomerCategoriesChanged.next(this.customerCategories);
          resolve(this.customerCategories);
        }, reject);
    }
    );
  }

  getPersons(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.persons$()
        .subscribe((response: any) => {

          this.persons = response;

          this.onPersonChanged.next(this.persons);
          resolve(this.persons);
        }, reject);
    }
    );
  }

  getBuyingGroups(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.buyingGroups$()
        .subscribe((response: any) => {

          this.buyingGroups = response;

          this.onBuyingGroupChanged.next(this.buyingGroups);
          resolve(this.buyingGroups);
        }, reject);
    }
    );
  }

  getAddresses(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.addresses$()
        .subscribe((response: any) => {

          this.addresses = response;

          this.onAddressChanged.next(this.addresses);
          resolve(this.addresses);
        }, reject);
    }
    );
  }

  getDeliveryMethods(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.deliveryMethods$()
        .subscribe((response: any) => {

          this.deliveryMethods = response;

          this.onDeliveryMethodsChanged.next(this.deliveryMethods);
          resolve(this.deliveryMethods);
        }, reject);
    }
    );
  }

  //feathers API
  customer$(id): Observable<any> {
    return (<any>this.feathers
      .service('sales/customers'))
      .watch()
      .get(id);
  }

  saveCustomer$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('sales/customers')
      .update(id, data));
  }

  addCustomer$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('sales/customers')
        .create(data)
        .then(res => res));
  }

  customerCategories$(): Observable<any[]> {
    return (<any>this.feathers
      .service('sales/customer-categories'))
      .watch()
      .find()
      .map(d => d.data);
  }

  persons$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/people'))
      .watch()
      .find({
        query: {
          "isPermittedToLogon": false,
          "isExternalLogonProvider": false,
          "isSystemUser": false,
          "isEmployee": false,
          "isSalesperson": false
        }
      })
      .map(d => d.data);
  }

  addresses$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/addresses'))
      .watch()
      .find()
      .map(d => d.data);
  }

  buyingGroups$(): Observable<any[]> {
    return (<any>this.feathers
      .service('sales/buying-groups'))
      .watch()
      .find()
      .map(d => d.data);
  }

  deliveryMethods$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/delivery-methods'))
      .watch()
      .find()
      .map(d => d.data);
  }
  //end feathers API
}
