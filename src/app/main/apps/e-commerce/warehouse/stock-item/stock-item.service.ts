import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/observable/fromPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { PxDataService } from '../../../../../services/data.service';
import { Feathers } from '@fuse/services/partials/feathers.service';

import { StockItem } from './stock-item.model';
// import { Store, select } from '@ngrx/store';
// import * as fromAuth from '@fuse/ngrx/auth/reducers';
// import * as Auth from '@fuse/ngrx/auth/actions/auth';
// import { User } from '@fuse/ngrx/auth/models';
import { PeopleService } from '@fuse/services/partials/people.service';
import { Image } from './stock-image/stock-image.model';
import { environment } from 'environments/environment';

@Injectable()
export class EcommerceStockItemService implements Resolve<any>
{
  routeParams: any;
  stockItem: any;
  newId: string;

  onStockItemChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onSupplierChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onColorChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onPackageTypeChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onStockGroupsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onImagesChanged: BehaviorSubject<any> = new BehaviorSubject({});

  suppliers: any;
  colors: any;
  packageTypes: any;
  authenticatedPeople: any;
  auth$: any;
  stockGroups: any;
  images: any[];
  api_base: string = `${environment.API_BASE}`;

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
        this.getStockItem(),
        this.getSuppliers(),
        this.getColors(),
        this.getPackageTypes(),
        this.getStockGroups(),
        this.getAuthenticatedPeople(),
        this.getImages(this.routeParams.id)
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getStockItem(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onStockItemChanged.next(false);
        resolve(false);
      }
      else {
        this.stockItem$(this.routeParams.id)
          .subscribe((response: any) => {
            this.stockItem = response;
            this.onStockItemChanged.next(this.stockItem);
            resolve(response);
          }, reject);
      }
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

  getSuppliers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.suppliers$()
        .subscribe((response: any) => {

          this.suppliers = response;

          this.onSupplierChanged.next(this.suppliers);
          resolve(this.suppliers);
        }, reject);
    }
    );
  }

  getColors(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.colors$()
        .subscribe((response: any) => {

          this.colors = response;

          this.onColorChanged.next(this.colors);
          resolve(this.colors);
        }, reject);
    }
    );
  }

  getPackageTypes(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.packageTypes$()
        .subscribe((response: any) => {

          this.packageTypes = response;

          this.onPackageTypeChanged.next(this.packageTypes);
          resolve(this.packageTypes);
        }, reject);
    }
    );
  }

  getStockGroups(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.stockGroups$()
        .subscribe((response: any) => {

          this.stockGroups = response;

          this.onStockGroupsChanged.next(this.stockGroups);
          resolve(this.stockGroups);
        }, reject);
    }
    );
  }

  saveStockItem(stockItem) {
    stockItem.lastEditedBy = this.authenticatedPeople._id;
    console.log(stockItem)
    return new Promise((resolve, reject) => {
      this.saveStockItem$(stockItem.id, stockItem)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  addStockItem(stockItem) {
    stockItem.lastEditedBy = this.authenticatedPeople._id;
    return new Promise((resolve, reject) => {
      this.addStockItem$(stockItem)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  //feathers API
  stockItem$(id): Observable<any> {
    return (<any>this.feathers
      .service('warehouse/stock-items'))
      .watch()
      .get(id);
  }

  suppliers$(): Observable<any[]> {
    return (<any>this.feathers
      .service('purchasing/suppliers'))
      .watch()
      .find()
      .map(d => d.data);
  }

  colors$(): Observable<any[]> {
    return (<any>this.feathers
      .service('warehouse/colors'))
      .watch()
      .find()
      .map(d => d.data);
  }

  packageTypes$(): Observable<any[]> {
    return (<any>this.feathers
      .service('warehouse/package-types'))
      .watch()
      .find()
      .map(d => d.data);
  }

  stockGroups$(): Observable<any[]> {
    return (<any>this.feathers
      .service('warehouse/stock-groups'))
      .watch()
      .find()
      .map(d => d.data);
  }

  saveStockItem$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(this.feathers
      .service('warehouse/stock-items')
      .update(id, data));
  }

  addStockItem$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('warehouse/stock-items')
        .create(data)
        .then(res => res));
  }
  //end feathers API

  getImages(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.images$(id)
        .subscribe((response: any) => {
          this.images = response;
          console.log(response)
          this.images.map(image => {
            this.http.get(this.api_base + "media?filename=" + image.fileName).subscribe((res: any) => {
              if (res.error) {
                image.uri = null;
              } else {
                image.uri = res;
              }
            })
          })
          this.onImagesChanged.next(response);
          resolve(response);
        }, reject);
    });
  }

  saveImage(id, image) {
    return new Promise((resolve, reject) => {
      this.saveImage$(id, image)
        .subscribe((response: any) => {
          this.getImages(id);
          resolve(response);
        }, reject);
    });
  }

  addImage(image, id) {
    return new Promise((resolve, reject) => {
      this.addImage$(image)
        .subscribe((response: any) => {
          // this.getImages(id);
          resolve(response);
        }, reject);
    });
  }

  removeImage(id) {
    return new Promise((resolve, reject) => {
      this.removeImage$(id)
        .subscribe((response: any) => {
          // this.getImages(id);
          resolve(response);
        }, reject);
    });
  }

  //feathers API
  private images$(id): Observable<any> {    
    if (id == 'new') return Observable.of([]);
    else
      return (<any>this.feathers
        .service('general/images'))
        .watch()
        .find(
          {
            query: {
              "stockItemId": id,
            }
          }
        )
        .map(d => d.data);
  }

  private addImage$(data: any): Observable<any> {
    if (data === '') {
      return;
    }

    return Observable.fromPromise(
      this.feathers
        .service('general/images')
        .create(data)
        .then(res => res)
        .catch(err => err));
  }

  private saveImage$(id: string, data: any): Observable<any> {
    if (data === '') {
      return;
    }
    console.log(id, data)
    return Observable.fromPromise(this.feathers
      .service('general/images')
      .update(id, data));
  }

  private removeImage$(id: string): Observable<any> {
    return Observable.fromPromise(this.feathers
      .service('general/images')
      .remove(id));
  }
  //end feathers API
}
