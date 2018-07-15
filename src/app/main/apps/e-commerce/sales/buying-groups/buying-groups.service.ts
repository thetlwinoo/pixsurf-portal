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

import { BuyingGroup } from './buying-groups.model';

@Injectable()
export class BuyingGroupsService implements Resolve<any>
{
  onBuyingGroupsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCountriesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedBuyingGroupsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  buyingGroups: BuyingGroup[];
  authenticatedPeople: any;
  selectedBuyingGroups: string[] = [];
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
   * The BuyingGroups App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getCountries(),
        this.getBuyingGroups(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getBuyingGroups();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getBuyingGroups();
          });

          resolve();

        },
        reject
      );
    });
  }

  getBuyingGroups(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.buyingGroups$()
        .subscribe((response: any) => {

          this.buyingGroups = response;

          if (this.filterBy === 'starred') {
            this.buyingGroups = this.buyingGroups.filter(_BuyingGroup => {
              return this.authenticatedPeople.starred.includes(_BuyingGroup.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.buyingGroups = this.buyingGroups.filter(_BuyingGroup => {
              return this.authenticatedPeople.frequentBuyingGroups.includes(_BuyingGroup.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.buyingGroups = FuseUtils.filterArrayByString(this.buyingGroups, this.searchText);
          }

          this.buyingGroups = this.buyingGroups.map(buyingGroup => {
            return new BuyingGroup(buyingGroup);
          });

          this.onBuyingGroupsChanged.next(this.buyingGroups);
          resolve(this.buyingGroups);
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
   * Toggle selected BuyingGroup by id
   * @param id
   */
  toggleSelectedBuyingGroup(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedBuyingGroups.length > 0) {
      const index = this.selectedBuyingGroups.indexOf(id);

      if (index !== -1) {
        this.selectedBuyingGroups.splice(index, 1);

        // Trigger the next event
        this.onSelectedBuyingGroupsChanged.next(this.selectedBuyingGroups);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedBuyingGroups.push(id);

    // Trigger the next event
    this.onSelectedBuyingGroupsChanged.next(this.selectedBuyingGroups);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedBuyingGroups.length > 0) {
      this.deselectBuyingGroups();
    }
    else {
      this.selectBuyingGroups();
    }
  }

  selectBuyingGroups(filterParameter?, filterValue?) {
    this.selectedBuyingGroups = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedBuyingGroups = [];
      this.buyingGroups.map(BuyingGroup => {
        this.selectedBuyingGroups.push(BuyingGroup.id);
      });
    }
    else {
      /* this.selectedBuyingGroups.push(...
           this.buyingGroups.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedBuyingGroupsChanged.next(this.selectedBuyingGroups);
  }

  addBuyingGroup(BuyingGroup) {
    BuyingGroup.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addBuyingGroup$({ ...BuyingGroup })
        .subscribe(response => {
          this.getBuyingGroups();
          resolve(response);
        });
    });
  }

  updateBuyingGroup(BuyingGroup) {
    BuyingGroup.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveBuyingGroup$(BuyingGroup.id, { ...BuyingGroup })
        .subscribe(response => {
          this.getBuyingGroups();
          resolve(response);
        });
    });
  }

  deselectBuyingGroups() {
    this.selectedBuyingGroups = [];

    // Trigger the next event
    this.onSelectedBuyingGroupsChanged.next(this.selectedBuyingGroups);
  }

  deleteBuyingGroup(BuyingGroup) {
    this.deleteBuyingGroup$(BuyingGroup.id);
    this.getBuyingGroups();
  }

  deleteSelectedBuyingGroups() {
    for (const BuyingGroupId of this.selectedBuyingGroups) {
      this.deleteBuyingGroup$(BuyingGroupId);
    }
    this.getBuyingGroups(); //custom added
    this.deselectBuyingGroups();
  }

  //feathers API
  buyingGroups$(): Observable<any[]> {
    return (<any>this.feathers
      .service('sales/buying-groups'))
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

  addBuyingGroup$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('sales/buying-groups')
        .create(data));
  }

  saveBuyingGroup$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('sales/buying-groups')
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

  deleteBuyingGroup$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('sales/buying-groups')
      .remove(id)
  }
  //end feathers API
}
