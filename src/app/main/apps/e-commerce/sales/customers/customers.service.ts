import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'environments/environment';
import { Feathers } from '@fuse/services/partials/feathers.service';

@Injectable()
export class EcommerceCustomersService implements Resolve<any>
{
  customers: any[];
  onCustomerChanged: BehaviorSubject<any> = new BehaviorSubject({});
  onSelectedCustomerChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  selectedCustomer: string[] = [];

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
        this.getCustomers()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  getCustomers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.customers$()
        .subscribe((response: any) => {
          this.customers = response;
          this.onCustomerChanged.next(this.customers);
          resolve(response);
        }, reject);
    });
  }

  /**
   * Toggle selected customer by id
   * @param id
   */
  toggleSelectedCustomer(id) {
    if (this.selectedCustomer.length > 0) {
      const index = this.selectedCustomer.indexOf(id);
      if (index !== -1) {
        this.selectedCustomer.splice(index, 1);
        this.onSelectedCustomerChanged.next(this.selectedCustomer);
        return;
      }
    }
    this.selectedCustomer.push(id);
    this.onSelectedCustomerChanged.next(this.selectedCustomer);
  }

  selectCustomers(filterParameter?, filterValue?) {
    this.selectedCustomer = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedCustomer = [];
      this.customers.map(customer => {
        this.selectedCustomer.push(customer._id);
      });
    }
    else {
      /* this.selectedCustomer.push(...
           this.customers.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }
    this.onSelectedCustomerChanged.next(this.selectedCustomer);
  }

  deselectCustomers() {
    this.selectedCustomer = [];
    this.onSelectedCustomerChanged.next(this.selectedCustomer);
  }

  deleteCustomer(customer) {
    this.deleteCustomer$(customer._id);
    this.getCustomers();
  }

  deleteSelectedCustomers() {
    for (const customerId of this.selectedCustomer) {
      this.deleteCustomer$(customerId);
    }
    // this.onCustomersChanged.next(this.customers);
    this.getCustomers(); //custom added
    this.deselectCustomers();
  }

  //feathers API
  customers$(): Observable<any[]> {
    return (<any>this.feathers
      .service('sales/customers'))
      .watch()
      .find({
        query: {
          $sort: { createdAt: -1 },
          $limit: 25
        }
      })
      .map(d => d.data);
  }

  deleteCustomer$(id) {
    if (id === '') {
      return;
    }

    this.feathers
      .service('sales/customers')
      .remove(id)
  }
  //end feathers API
}
