import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'environments/environment';
import { Feathers } from '@fuse/services/partials/feathers.service';

@Injectable()
export class EcommerceSuppliersService implements Resolve<any>
{
  suppliers: any[];
  onSupplierChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onSelectedSupplierChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  selectedSupplier: string[] = [];

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
        this.getSuppliers()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getSuppliers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.suppliers$()
        .subscribe((response: any) => {
          this.suppliers = response;
          this.onSupplierChanged.next(this.suppliers);
          resolve(response);
        }, reject);
    });
  }

  /**
   * Toggle selected supplier by id
   * @param id
   */
  toggleSelectedSupplier(id) {
    if (this.selectedSupplier.length > 0) {
      const index = this.selectedSupplier.indexOf(id);
      if (index !== -1) {
        this.selectedSupplier.splice(index, 1);
        this.onSelectedSupplierChanged.next(this.selectedSupplier);
        return;
      }
    }
    this.selectedSupplier.push(id);
    this.onSelectedSupplierChanged.next(this.selectedSupplier);
  }

  selectSuppliers(filterParameter?, filterValue?) {
    this.selectedSupplier = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedSupplier = [];
      this.suppliers.map(supplier => {
        this.selectedSupplier.push(supplier._id);
      });
    }
    else {
      /* this.selectedSupplier.push(...
           this.suppliers.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }
    this.onSelectedSupplierChanged.next(this.selectedSupplier);
  }

  deselectSuppliers() {
    this.selectedSupplier = [];
    this.onSelectedSupplierChanged.next(this.selectedSupplier);
  }

  deleteSupplier(supplier) {
    this.deleteSupplier$(supplier._id);
    this.getSuppliers();
  }

  deleteSelectedSuppliers() {
    for (const supplierId of this.selectedSupplier) {
      this.deleteSupplier$(supplierId);
    }
    // this.onSuppliersChanged.next(this.suppliers);
    this.getSuppliers(); //custom added
    this.deselectSuppliers();
  }

  //feathers API
  suppliers$(): Observable<any[]> {
    return (<any>this.feathers
      .service('purchasing/suppliers'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data);
  }

  deleteSupplier$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('purchasing/suppliers')
      .remove(id)
  }
  //end feathers API
}
