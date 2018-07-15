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
import { AddressType } from './address-types.model';

@Injectable()
export class AddressTypesService implements Resolve<any>
{
  onAddressTypesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCountriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedAddressTypesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  addressTypes: AddressType[];
  authenticatedPeople: any;
  selectedAddressTypes: string[] = [];
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
   * The AddressTypes App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getCountries(),
        this.getAddressTypes(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getAddressTypes();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getAddressTypes();
          });

          resolve();

        },
        reject
      );
    });
  }

  getAddressTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.addressTypes$()
        .subscribe((response: any) => {

          this.addressTypes = response;

          if (this.filterBy === 'starred') {
            this.addressTypes = this.addressTypes.filter(_AddressType => {
              return this.authenticatedPeople.starred.includes(_AddressType.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.addressTypes = this.addressTypes.filter(_AddressType => {
              return this.authenticatedPeople.frequentAddressTypes.includes(_AddressType.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.addressTypes = FuseUtils.filterArrayByString(this.addressTypes, this.searchText);
          }

          this.addressTypes = this.addressTypes.map(addressType => {
            return new AddressType(addressType);
          });

          this.onAddressTypesChanged.next(this.addressTypes);
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
   * Toggle selected AddressType by id
   * @param id
   */
  toggleSelectedAddressType(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedAddressTypes.length > 0) {
      const index = this.selectedAddressTypes.indexOf(id);

      if (index !== -1) {
        this.selectedAddressTypes.splice(index, 1);

        // Trigger the next event
        this.onSelectedAddressTypesChanged.next(this.selectedAddressTypes);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedAddressTypes.push(id);

    // Trigger the next event
    this.onSelectedAddressTypesChanged.next(this.selectedAddressTypes);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedAddressTypes.length > 0) {
      this.deselectAddressTypes();
    }
    else {
      this.selectAddressTypes();
    }
  }

  selectAddressTypes(filterParameter?, filterValue?) {
    this.selectedAddressTypes = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedAddressTypes = [];
      this.addressTypes.map(AddressType => {
        this.selectedAddressTypes.push(AddressType.id);
      });
    }
    else {
      /* this.selectedAddressTypes.push(...
           this.addressTypes.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedAddressTypesChanged.next(this.selectedAddressTypes);
  }

  addAddressType(AddressType) {
    AddressType.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addAddressType$({ ...AddressType })
        .subscribe(response => {
          this.getAddressTypes();
          resolve(response);
        });
    });
  }

  updateAddressType(AddressType) {
    AddressType.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveAddressType$(AddressType.id, { ...AddressType })
        .subscribe(response => {
          this.getAddressTypes();
          resolve(response);
        });
    });
  }

  deselectAddressTypes() {
    this.selectedAddressTypes = [];

    // Trigger the next event
    this.onSelectedAddressTypesChanged.next(this.selectedAddressTypes);
  }

  deleteAddressType(AddressType) {
    this.deleteAddressType$(AddressType.id);
    this.getAddressTypes();
  }

  deleteSelectedAddressTypes() {
    for (const AddressTypeId of this.selectedAddressTypes) {
      this.deleteAddressType$(AddressTypeId);
    }
    this.getAddressTypes(); //custom added
    this.deselectAddressTypes();
  }

  //feathers API
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

  addAddressType$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('general/address-types')
        .create(data));
  }

  saveAddressType$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('general/address-types')
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

  deleteAddressType$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('general/address-types')
      .remove(id)
  }
  //end feathers API
}
