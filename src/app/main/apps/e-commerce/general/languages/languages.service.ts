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

import { Language } from './language.model';

@Injectable()
export class LanguagesService implements Resolve<any>
{
  onLanguagesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onStateProvincesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedLanguagesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onFilterChanged: Subject<any> = new Subject();

  languages: Language[];
  stateProvinces: any;
  authenticatedPeople: any;
  selectedLanguages: string[] = [];
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
   * The Languages App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        this.getLanguages(),
        this.getStateProvinces(),
        this.getAuthenticatedPeople()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            this.searchText = searchText;
            this.getLanguages();
          });

          this.onFilterChanged.subscribe(filter => {
            this.filterBy = filter;
            this.getLanguages();
          });

          resolve();

        },
        reject
      );
    });
  }

  getLanguages(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.languages$()
        .subscribe((response: any) => {

          this.languages = response;

          if (this.filterBy === 'starred') {
            this.languages = this.languages.filter(_language => {
              return this.authenticatedPeople.starred.includes(_language.id);
            });
          }

          if (this.filterBy === 'frequent') {
            this.languages = this.languages.filter(_language => {
              return this.authenticatedPeople.frequentLanguages.includes(_language.id);
            });
          }

          if (this.searchText && this.searchText !== '') {
            this.languages = FuseUtils.filterArrayByString(this.languages, this.searchText);
          }

          this.languages = this.languages.map(language => {
            return new Language(language);
          });

          this.onLanguagesChanged.next(this.languages);
          resolve(this.languages);
        }, reject);
    }
    );
  }

  getStateProvinces(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stateProvinces$()
        .subscribe((response: any) => {

          this.stateProvinces = response;

          this.onStateProvincesChanged.next(this.stateProvinces);
          resolve(this.stateProvinces);
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
   * Toggle selected language by id
   * @param id
   */
  toggleSelectedLanguage(id) {
    // First, check if we already have that todo as selected...
    if (this.selectedLanguages.length > 0) {
      const index = this.selectedLanguages.indexOf(id);

      if (index !== -1) {
        this.selectedLanguages.splice(index, 1);

        // Trigger the next event
        this.onSelectedLanguagesChanged.next(this.selectedLanguages);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedLanguages.push(id);

    // Trigger the next event
    this.onSelectedLanguagesChanged.next(this.selectedLanguages);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll() {
    if (this.selectedLanguages.length > 0) {
      this.deselectLanguages();
    }
    else {
      this.selectLanguages();
    }
  }

  selectLanguages(filterParameter?, filterValue?) {
    this.selectedLanguages = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedLanguages = [];
      this.languages.map(language => {
        this.selectedLanguages.push(language.id);
      });
    }
    else {
      /* this.selectedLanguages.push(...
           this.languages.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedLanguagesChanged.next(this.selectedLanguages);
  }

  addLanguage(language) {
    language.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addLanguage$({ ...language })
        .subscribe(response => {
          this.getLanguages();
          resolve(response);
        });
    });
  }

  updateLanguage(language) {
    language.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {

      this.saveLanguage$(language.id, { ...language })
        .subscribe(response => {
          this.getLanguages();
          resolve(response);
        });
    });
  }

  deselectLanguages() {
    this.selectedLanguages = [];

    // Trigger the next event
    this.onSelectedLanguagesChanged.next(this.selectedLanguages);
  }

  deleteLanguage(language) {
    this.deleteLanguage$(language.id);
    this.getLanguages();
  }

  deleteSelectedLanguages() {
    for (const languageId of this.selectedLanguages) {
      this.deleteLanguage$(languageId);
    }
    this.getLanguages(); //custom added
    this.deselectLanguages();
  }

  //feathers API
  languages$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/languages'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data);
  }

  stateProvinces$(): Observable<any[]> {
    return (<any>this.feathers
      .service('general/state-provinces'))
      .watch()
      .find()
      .map(d => d.data);
  }

  addLanguage$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('general/languages')
        .create(data));
  }

  saveLanguage$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('general/languages')
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

  deleteLanguage$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('general/languages')
      .remove(id)
  }
  //end feathers API
}
