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
import { StockGroup } from './stock-group.model';

@Injectable()
export class StockGroupsService implements Resolve<any>
{
  onStockGroupsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedStockGroupsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  stockGroups: StockGroup[];
  authenticatedPeople: any;
  selectedStockGroups: string[] = [];
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
   * The StockGroups App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getStockGroups(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getStockGroups();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getStockGroups();
          });

          resolve();

        },
        reject
      );
    });
  }

  getStockGroups(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stockGroups$()
        .subscribe((response: any) => {

          this.stockGroups = response;

          if (this.filterBy === 'starred') {
            this.stockGroups = this.stockGroups.filter(_stockGroup => {
              return this.authenticatedPeople.starred.includes(_stockGroup.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.stockGroups = this.stockGroups.filter(_stockGroup => {
              return this.authenticatedPeople.frequentStockGroups.includes(_stockGroup.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.stockGroups = FuseUtils.filterArrayByString(this.stockGroups, this.searchText);
          }

          this.stockGroups = this.stockGroups.map(stockGroup => {
            return new StockGroup(stockGroup);
          });

          this.onStockGroupsChanged.next(this.stockGroups);
          resolve(this.stockGroups);
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
   * Toggle selected stockGroup by id
   * @param id
   */
  toggleSelectedStockGroup(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedStockGroups.length > 0) {
      const index = this.selectedStockGroups.indexOf(id);

      if (index !== -1) {
        this.selectedStockGroups.splice(index, 1);

        // Trigger the next event
        this.onSelectedStockGroupsChanged.next(this.selectedStockGroups);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedStockGroups.push(id);

    // Trigger the next event
    this.onSelectedStockGroupsChanged.next(this.selectedStockGroups);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedStockGroups.length > 0) {
      this.deselectStockGroups();
    }
    else {
      this.selectStockGroups();
    }
  }

  selectStockGroups(filterParameter?, filterValue?) {
    this.selectedStockGroups = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedStockGroups = [];
      this.stockGroups.map(stockGroup => {
        this.selectedStockGroups.push(stockGroup.id);
      });
    }
    else {
      /* this.selectedStockGroups.push(...
           this.stockGroups.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedStockGroupsChanged.next(this.selectedStockGroups);
  }

  addStockGroup(stockGroup) {
    stockGroup.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addStockGroup$({ ...stockGroup })
        .subscribe(response => {
          this.getStockGroups();
          resolve(response);
        });
    });
  }

  updateStockGroup(stockGroup) {
    stockGroup.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveStockGroup$(stockGroup.id, { ...stockGroup })
        .subscribe(response => {
          this.getStockGroups();
          resolve(response);
        });
    });
  }

  deselectStockGroups() {
    this.selectedStockGroups = [];

    // Trigger the next event
    this.onSelectedStockGroupsChanged.next(this.selectedStockGroups);
  }

  deleteStockGroup(stockGroup) {
    this.deleteStockGroup$(stockGroup.id);
    this.getStockGroups();
  }

  deleteSelectedStockGroups() {
    for (const stockGroupId of this.selectedStockGroups) {
      this.deleteStockGroup$(stockGroupId);
    }
    this.getStockGroups(); //custom added
    this.deselectStockGroups();
  }

  //feathers API
  stockGroups$(): Observable<any[]> {
    return (<any>this.feathers
      .service('warehouse/stock-groups'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data);
  }

  addStockGroup$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('warehouse/stock-groups')
        .create(data));
  }

  saveStockGroup$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('warehouse/stock-groups')
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

  deleteStockGroup$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('warehouse/stock-groups')
      .remove(id)
  }
  //end feathers API
}
