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
import { SupplierCategory } from './supplier-categories.model';

@Injectable()
export class SupplierCategoriesService implements Resolve<any>
{
  onSupplierCategoriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedSupplierCategoriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  supplierCategories: SupplierCategory[];
  authenticatedPeople: any;
  selectedSupplierCategories: string[] = [];
  people$: any;
  searchText: string;
  filterBy: string;

  constructor(
    // private store: Store<fromAuth.State>,
    private http: HttpClient,
    private feathers: Feathers,
    private people: PeopleService
  ) {
    // this.people$ = this.store.pipe(select(fromAuth.getAuthenticatedPeople));
  }

  /**
   * The SupplierCategories App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getSupplierCategories(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getSupplierCategories();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getSupplierCategories();
          });

          resolve();

        },
        reject
      );
    });
  }

  getSupplierCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.supplierCategories$()
        .subscribe((response: any) => {

          this.supplierCategories = response;

          if (this.filterBy === 'starred') {
            this.supplierCategories = this.supplierCategories.filter(_SupplierCategory => {
              return this.authenticatedPeople.starred.includes(_SupplierCategory.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.supplierCategories = this.supplierCategories.filter(_SupplierCategory => {
              return this.authenticatedPeople.frequentSupplierCategories.includes(_SupplierCategory.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.supplierCategories = FuseUtils.filterArrayByString(this.supplierCategories, this.searchText);
          }

          this.supplierCategories = this.supplierCategories.map(supplierCategory => {
            return new SupplierCategory(supplierCategory);
          });

          this.onSupplierCategoriesChanged.next(this.supplierCategories);
          resolve(this.supplierCategories);
        }, reject);
    }
    );
  }

  getAuthenticatedPeople(): Promise<any> {
    // return new Promise((resolve, reject) => {
    //   this.people$
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
   * Toggle selected SupplierCategory by id
   * @param id
   */
  toggleSelectedSupplierCategory(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedSupplierCategories.length > 0) {
      const index = this.selectedSupplierCategories.indexOf(id);

      if (index !== -1) {
        this.selectedSupplierCategories.splice(index, 1);

        // Trigger the next event
        this.onSelectedSupplierCategoriesChanged.next(this.selectedSupplierCategories);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedSupplierCategories.push(id);

    // Trigger the next event
    this.onSelectedSupplierCategoriesChanged.next(this.selectedSupplierCategories);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedSupplierCategories.length > 0) {
      this.deselectSupplierCategories();
    }
    else {
      this.selectSupplierCategories();
    }
  }

  selectSupplierCategories(filterParameter?, filterValue?) {
    this.selectedSupplierCategories = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedSupplierCategories = [];
      this.supplierCategories.map(SupplierCategory => {
        this.selectedSupplierCategories.push(SupplierCategory.id);
      });
    }
    else {
      /* this.selectedSupplierCategories.push(...
           this.supplierCategories.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedSupplierCategoriesChanged.next(this.selectedSupplierCategories);
  }

  addSupplierCategory(SupplierCategory) {
    SupplierCategory.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addSupplierCategory$({ ...SupplierCategory })
        .subscribe(response => {
          this.getSupplierCategories();
          resolve(response);
        });
    });
  }

  updateSupplierCategory(SupplierCategory) {
    SupplierCategory.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveSupplierCategory$(SupplierCategory.id, { ...SupplierCategory })
        .subscribe(response => {
          this.getSupplierCategories();
          resolve(response);
        });
    });
  }

  deselectSupplierCategories() {
    this.selectedSupplierCategories = [];

    // Trigger the next event
    this.onSelectedSupplierCategoriesChanged.next(this.selectedSupplierCategories);
  }

  deleteSupplierCategory(SupplierCategory) {
    this.deleteSupplierCategory$(SupplierCategory.id);
    this.getSupplierCategories();
  }

  deleteSelectedSupplierCategories() {
    for (const SupplierCategoryId of this.selectedSupplierCategories) {
      this.deleteSupplierCategory$(SupplierCategoryId);
    }
    this.getSupplierCategories(); //custom added
    this.deselectSupplierCategories();
  }

  //feathers API
  supplierCategories$(): Observable<any[]> {
    return (<any>this.feathers
      .service('purchasing/supplier-categories'))
      .watch()
      .find()
      .map(d => d.data);
  }

  addSupplierCategory$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('purchasing/supplier-categories')
        .create(data));
  }

  saveSupplierCategory$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('purchasing/supplier-categories')
      .update(id, data));
  }

  users$(): Observable<any[]> {
    return (<any>this.feathers
      .service('purchasing/people'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data);
  }

  deleteSupplierCategory$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('purchasing/supplier-categories')
      .remove(id)
  }
  //end feathers API
}
