import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Feathers } from '@fuse/services/partials/feathers.service';
import { FuseUtils } from '@fuse/utils';
import { Subscription } from 'rxjs/Subscription';
// import { Store, select } from '@ngrx/store';
// import * as fromAuth from '@fuse/ngrx/auth/reducers';
// import * as Auth from '@fuse/ngrx/auth/actions/auth';
// import { User } from '@fuse/ngrx/auth/models';

import { Color } from './color.model';
import { PeopleService } from '@fuse/services/partials/people.service';

@Injectable()
export class ColorsService implements Resolve<any>
{
  onColorsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onStateProvincesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedColorsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  colors: Color[];
  authenticatedPeople: any;
  selectedColors: string[] = [];
  // auth$: any;

  searchText: string;
  filterBy: string;

  onPeopleChanged: Subscription;

  constructor(
    // private store: Store<fromAuth.State>,
    private http: HttpClient,
    private feathers: Feathers,
    private people: PeopleService
  ) {
    // this.auth$ = this.store.pipe(select(fromAuth.getAuthenticatedPeople));
  }

  /**
   * The Colors App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getColors(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getColors();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getColors();
          });


          resolve();

        },
        reject
      );
    });
  }

  getColors(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.colors$()
        .subscribe((response: any) => {

          this.colors = response;

          if (this.filterBy === 'starred') {
            this.colors = this.colors.filter(_color => {
              return this.authenticatedPeople.starred.includes(_color.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.colors = this.colors.filter(_color => {
              return this.authenticatedPeople.frequentColors.includes(_color.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.colors = FuseUtils.filterArrayByString(this.colors, this.searchText);
          }

          this.colors = this.colors.map(color => {
            return new Color(color);
          });

          this.onColorsChanged.next(this.colors);
          resolve(this.colors);
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
   * Toggle selected color by id
   * @param id
   */
  toggleSelectedColor(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedColors.length > 0) {
      const index = this.selectedColors.indexOf(id);

      if (index !== -1) {
        this.selectedColors.splice(index, 1);

        // Trigger the next event
        this.onSelectedColorsChanged.next(this.selectedColors);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedColors.push(id);

    // Trigger the next event
    this.onSelectedColorsChanged.next(this.selectedColors);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedColors.length > 0) {
      this.deselectColors();
    }
    else {
      this.selectColors();
    }
  }

  selectColors(filterParameter?, filterValue?) {
    this.selectedColors = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedColors = [];
      this.colors.map(color => {
        this.selectedColors.push(color.id);
      });
    }
    else {
      /* this.selectedColors.push(...
           this.colors.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedColorsChanged.next(this.selectedColors);
  }

  addColor(color) {
    color.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addColor$({ ...color })
        .subscribe(response => {
          this.getColors();
          resolve(response);
        });
    });
  }

  updateColor(color) {
    color.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveColor$(color.id, { ...color })
        .subscribe(response => {
          this.getColors();
          resolve(response);
        });
    });
  }

  deselectColors() {
    this.selectedColors = [];

    // Trigger the next event
    this.onSelectedColorsChanged.next(this.selectedColors);
  }

  deleteColor(color) {
    this.deleteColor$(color.id);
    this.getColors();
  }

  deleteSelectedColors() {
    for (const colorId of this.selectedColors) {
      this.deleteColor$(colorId);
    }
    this.getColors(); //custom added
    this.deselectColors();
  }

  //feathers API
  colors$(): Observable<any[]> {
    return (<any>this.feathers
      .service('warehouse/colors'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data);
  }

  addColor$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('warehouse/colors')
        .create(data));
  }

  saveColor$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('warehouse/colors')
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

  deleteColor$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('warehouse/colors')
      .remove(id)
  }
  //end feathers API
}
