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

import { PackageType } from './package-type.model';

@Injectable()
export class PackageTypesService implements Resolve<any>
{
  onPackageTypesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedPackageTypesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  packageTypes: PackageType[];
  authenticatedPeople: any;
  selectedPackageTypes: string[] = [];
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
   * The PackageTypes App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getPackageTypes(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getPackageTypes();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getPackageTypes();
          });

          resolve();

        },
        reject
      );
    });
  }

  getPackageTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.packageTypes$()
        .subscribe((response: any) => {

          this.packageTypes = response;

          if (this.filterBy === 'starred') {
            this.packageTypes = this.packageTypes.filter(_packageType => {
              return this.authenticatedPeople.starred.includes(_packageType.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.packageTypes = this.packageTypes.filter(_packageType => {
              return this.authenticatedPeople.frequentPackageTypes.includes(_packageType.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.packageTypes = FuseUtils.filterArrayByString(this.packageTypes, this.searchText);
          }

          this.packageTypes = this.packageTypes.map(packageType => {
            return new PackageType(packageType);
          });

          this.onPackageTypesChanged.next(this.packageTypes);
          resolve(this.packageTypes);
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
   * Toggle selected packageType by id
   * @param id
   */
  toggleSelectedPackageType(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedPackageTypes.length > 0) {
      const index = this.selectedPackageTypes.indexOf(id);

      if (index !== -1) {
        this.selectedPackageTypes.splice(index, 1);

        // Trigger the next event
        this.onSelectedPackageTypesChanged.next(this.selectedPackageTypes);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedPackageTypes.push(id);

    // Trigger the next event
    this.onSelectedPackageTypesChanged.next(this.selectedPackageTypes);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedPackageTypes.length > 0) {
      this.deselectPackageTypes();
    }
    else {
      this.selectPackageTypes();
    }
  }

  selectPackageTypes(filterParameter?, filterValue?) {
    this.selectedPackageTypes = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedPackageTypes = [];
      this.packageTypes.map(packageType => {
        this.selectedPackageTypes.push(packageType.id);
      });
    }
    else {
      /* this.selectedPackageTypes.push(...
           this.packageTypes.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedPackageTypesChanged.next(this.selectedPackageTypes);
  }

  addPackageType(packageType) {
    packageType.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addPackageType$({ ...packageType })
        .subscribe(response => {
          this.getPackageTypes();
          resolve(response);
        });
    });
  }

  updatePackageType(packageType) {
    packageType.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.savePackageType$(packageType.id, { ...packageType })
        .subscribe(response => {
          this.getPackageTypes();
          resolve(response);
        });
    });
  }

  deselectPackageTypes() {
    this.selectedPackageTypes = [];

    // Trigger the next event
    this.onSelectedPackageTypesChanged.next(this.selectedPackageTypes);
  }

  deletePackageType(packageType) {
    this.deletePackageType$(packageType.id);
    this.getPackageTypes();
  }

  deleteSelectedPackageTypes() {
    for (const packageTypeId of this.selectedPackageTypes) {
      this.deletePackageType$(packageTypeId);
    }
    this.getPackageTypes(); //custom added
    this.deselectPackageTypes();
  }

  //feathers API
  packageTypes$(): Observable<any[]> {
    return (<any>this.feathers
      .service('warehouse/package-types'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data);
  }

  addPackageType$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('warehouse/package-types')
        .create(data));
  }

  savePackageType$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('warehouse/package-types')
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

  deletePackageType$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('warehouse/package-types')
      .remove(id)
  }
  //end feathers API
}
