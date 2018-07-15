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

import { Address } from './addresses.model';

@Injectable()
export class AddressesService implements Resolve<any>
{
  onAddressesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onStateProvinceChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onAddressTypeChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCityChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCountryChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedAddressesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  addresses: Address[];
  stateProvinces: any;
  cities: any;
  addressTypes: any;
  countries: any;
  authenticatedPeople: any;
  selectedAddresses: string[] = [];
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
   * The Addresses App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getAddresses(),
        this.getStateProvinces(),
        this.getCities(),
        this.getAddressTypes(),
        this.getCountries(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getAddresses();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getAddresses();
          });

          resolve();

        },
        reject
      );
    });
  }

  getAddresses(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.addresses$()
        .subscribe((response: any) => {

          this.addresses = response;
 console.log(response)
          if (this.filterBy === 'starred') {
            this.addresses = this.addresses.filter(_address => {
              return this.authenticatedPeople.starred.includes(_address.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.addresses = this.addresses.filter(_address => {
              return this.authenticatedPeople.frequentAddresses.includes(_address.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.addresses = FuseUtils.filterArrayByString(this.addresses, this.searchText);
          }

          this.addresses = this.addresses.map(address => {
            return new Address(address);
          });

          this.onAddressesChanged.next(this.addresses);
          resolve(this.addresses);
        }, reject);
    }
    );
  }

  getStateProvinces(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stateProvinces$()
        .subscribe((response: any) => {

          this.stateProvinces = response;

          this.onStateProvinceChanged.next(this.stateProvinces);
          resolve(this.stateProvinces);
        }, reject);
    }
    );
  }

  getCities(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cities$()
        .subscribe((response: any) => {

          this.cities = response;

          this.onCityChanged.next(this.cities);
          resolve(this.cities);
        }, reject);
    }
    );
  }

  getAddressTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.addressTypes$()
        .subscribe((response: any) => {

          this.addressTypes = response;

          this.onAddressTypeChanged.next(this.addressTypes);
          resolve(this.addressTypes);
        }, reject);
    }
    );
  }

  getCountries(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.countries$()
        .subscribe((response: any) => {

          this.countries = response;

          this.onCountryChanged.next(this.countries);
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
   * Toggle selected address by id
   * @param id
   */
  toggleSelectedAddress(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedAddresses.length > 0) {
      const index = this.selectedAddresses.indexOf(id);

      if (index !== -1) {
        this.selectedAddresses.splice(index, 1);

        // Trigger the next event
        this.onSelectedAddressesChanged.next(this.selectedAddresses);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedAddresses.push(id);

    // Trigger the next event
    this.onSelectedAddressesChanged.next(this.selectedAddresses);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedAddresses.length > 0) {
      this.deselectAddresses();
    }
    else {
      this.selectAddresses();
    }
  }

  selectAddresses(filterParameter?, filterValue?) {
    this.selectedAddresses = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedAddresses = [];
      this.addresses.map(address => {
        this.selectedAddresses.push(address.id);
      });
    }
    else {
      /* this.selectedAddresses.push(...
           this.addresses.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedAddressesChanged.next(this.selectedAddresses);
  }

  addAddress(address) {
    address.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addAddress$({ ...address })
        .subscribe(response => {
          this.getAddresses();
          resolve(response);
        });
    });
  }

  updateAddress(address) {
    address.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveAddress$(address.id, { ...address })
        .subscribe(response => {
          this.getAddresses();
          resolve(response);
        });
    });
  }

  deselectAddresses() {
    this.selectedAddresses = [];

    // Trigger the next event
    this.onSelectedAddressesChanged.next(this.selectedAddresses);
  }

  deleteAddress(address) {
    this.deleteAddress$(address.id);
    this.getAddresses();
  }

  deleteSelectedAddresses() {
    for (const addressId of this.selectedAddresses) {
      this.deleteAddress$(addressId);
    }
    this.getAddresses(); //custom added
    this.deselectAddresses();
  }

  //feathers API
  addresses$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/addresses'))
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

  cities$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/cities'))
      .watch()
      .find()
      .map(d => d.data);
  }

  addressTypes$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/address-types'))
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

  addAddress$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('general/addresses')
        .create(data));
  }

  saveAddress$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('general/addresses')
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

  deleteAddress$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('general/addresses')
      .remove(id)
  }
  //end feathers API
}
