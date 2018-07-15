import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { PxDataService } from '@fuse/services/partials/data.service';
import { Feathers } from '@fuse/services/partials/feathers.service';

import { Supplier } from './supplier.model';
// import { Store, select } from '@ngrx/store';
// import * as fromAuth from '@fuse/ngrx/auth/reducers';
// import * as Auth from '@fuse/ngrx/auth/actions/auth';
// import { User } from '@fuse/ngrx/auth/models';
import { PeopleService } from '@fuse/services/partials/people.service';

@Injectable()
export class EcommerceSupplierService implements Resolve<any>
{
  routeParams: any;
  newId: string;

  supplier: Supplier;
  authenticatedPeople: any;
  supplierCategories: any;
  persons: any;
  cities: any;
  deliveryMethods: any;
  auth$: any;

  onSupplierChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSupplierCategoriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onPersonChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCitiesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
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
        this.getSupplier(),
        this.getSupplierCategories(),
        this.getPersons(),
        this.getCities(),
        this.getDeliveryMethods(),
        this.getAuthenticatedPeople()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getSupplier(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onSupplierChanged.next(false);
        resolve(false);
      }
      else {
        this.supplier$(this.routeParams.id)
          .subscribe((response: any) => {
            this.supplier = response;
            this.onSupplierChanged.next(this.supplier);
            resolve(response);
          }, reject);
      }
    });
  }

  saveSupplier(supplier) {
    supplier.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {      
      this.saveSupplier$(supplier.id, supplier)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  addSupplier(supplier) {
    supplier.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addSupplier$(supplier)
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

  getSupplierCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.supplierCategories$()
        .subscribe((response: any) => {

          this.supplierCategories = response;

          this.onSupplierCategoriesChanged.next(this.supplierCategories);
          resolve(this.supplierCategories);
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

  getCities(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cities$()
        .subscribe((response: any) => {

          this.cities = response;

          this.onCitiesChanged.next(this.cities);
          resolve(this.cities);
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
  supplier$(id): Observable<any> {
    return (<any>this.feathers
      .service('purchasing/suppliers'))
      .watch()
      .get(id);
  }

  saveSupplier$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('purchasing/suppliers')
      .update(id, data));
  }

  addSupplier$(data: any): Observable<any> {
    if (data === '') {
      return;
    }
    
    return Observable.fromPromise(
      this.feathers
        .service('purchasing/suppliers')
        .create(data)
        .then(res => res));
  }

  supplierCategories$(): Observable<any[]> {
    return (<any>this.feathers
      .service('purchasing/supplier-categories'))
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

  cities$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/cities'))
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
