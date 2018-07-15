import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../../../environments/environment';
import { Feathers } from '@fuse/services/partials/feathers.service';

@Injectable()
export class EcommercePeopleService implements Resolve<any>
{
  people: any[];
  onPeopleChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onSelectedPeopleChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  selectedPeople: string[] = [];

  constructor(
    private http: HttpClient,
    private feathers: Feathers
  ) { }

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getPeople()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getPeople(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.people$()
        .subscribe((response: any) => {
          this.people = response;
          this.onPeopleChanged.next(this.people);
          resolve(response);
        }, reject);
    });
  }

  /**
   * Toggle selected people by id
   * @param id
   */
  toggleSelectedPeople(id) {
    if (this.selectedPeople.length > 0) {
      const index = this.selectedPeople.indexOf(id);
      if (index !== -1) {
        this.selectedPeople.splice(index, 1);
        this.onSelectedPeopleChanged.next(this.selectedPeople);
        return;
      }
    }
    this.selectedPeople.push(id);
    this.onSelectedPeopleChanged.next(this.selectedPeople);
  }

  selectPeople(filterParameter?, filterValue?) {
    this.selectedPeople = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedPeople = [];
      this.people.map(people => {
        this.selectedPeople.push(people._id);
      });
    }
    else {
      /* this.selectedPeople.push(...
           this.people.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }
    this.onSelectedPeopleChanged.next(this.selectedPeople);
  }

  deselectPeople() {
    this.selectedPeople = [];
    this.onSelectedPeopleChanged.next(this.selectedPeople);
  }

  deletePeople(people) {
    this.deletePeople$(people._id);
    this.getPeople();
  }

  deleteSelectedPeople() {
    for (const peopleId of this.selectedPeople) {
      this.deletePeople$(peopleId);
    }
    this.getPeople(); //custom added
    this.deselectPeople();
  }

  //feathers API
  people$(): Observable<any[]> {
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

  deletePeople$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('general/people')
      .remove(id)
  }
  //end feathers API
}
