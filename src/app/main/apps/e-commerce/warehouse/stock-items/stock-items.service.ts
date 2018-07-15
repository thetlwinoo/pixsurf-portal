import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'environments/environment';
import { Feathers } from '@fuse/services/partials/feathers.service';
import { Page } from '@fuse/models/page.model';

@Injectable()
export class EcommerceStockItemsService implements Resolve<any>
{
    stockItems: any[];
    onStockItemsChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSelectedStockItemsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    selectedStockItems: string[] = [];
    page: Page;

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
                this.getStockItems(0)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getStockItems(skip): Promise<any> {
        return new Promise((resolve, reject) => {
            this.stockItems$(skip)
                .subscribe((response: any) => {
                    this.stockItems = response;
                    this.onStockItemsChanged.next(this.stockItems);
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Toggle selected stockItem by id
     * @param id
     */
    toggleSelectedStockItem(id) {
        if (this.selectedStockItems.length > 0) {
            const index = this.selectedStockItems.indexOf(id);
            if (index !== -1) {
                this.selectedStockItems.splice(index, 1);
                this.onSelectedStockItemsChanged.next(this.selectedStockItems);
                return;
            }
        }
        this.selectedStockItems.push(id);
        this.onSelectedStockItemsChanged.next(this.selectedStockItems);
    }

    selectStockItems(filterParameter?, filterValue?) {
        this.selectedStockItems = [];

        // If there is no filter, select all todos
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedStockItems = [];
            this.stockItems.map(stockItem => {
                this.selectedStockItems.push(stockItem._id);
            });
        }
        else {
            /* this.selectedStockItems.push(...
                 this.stockItems.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }
        this.onSelectedStockItemsChanged.next(this.selectedStockItems);
    }

    deselectStockItems() {
        this.selectedStockItems = [];
        this.onSelectedStockItemsChanged.next(this.selectedStockItems);
    }

    deleteStockItem(stockItem) {
        // const stockItemIndex = this.stockItems.indexOf(stockItem);
        // this.stockItems.splice(stockItemIndex, 1);
        // this.onStockItemsChanged.next(this.stockItems);
        this.deleteStockItem$(stockItem._id);
        this.getStockItems(0);
    }

    deleteSelectedStockItems() {
        for (const stockItemId of this.selectedStockItems) {
            // const stockItem = this.stockItems.find(_stockItem => {
            //     return _stockItem.id === stockItemId;
            // });
            // const stockItemIndex = this.stockItems.indexOf(stockItem);
            // this.stockItems.splice(stockItemIndex, 1);
            this.deleteStockItem$(stockItemId);
        }
        // this.onStockItemsChanged.next(this.stockItems);
        this.getStockItems(0); //custom added
        this.deselectStockItems();
    }

    //feathers API
    stockItems$(skip): Observable<any[]> {
        return (<any>this.feathers
            .service('warehouse/stock-items'))
            .watch()
            .find({
                query: {
                    $limit: 10,
                    $skip: skip * 10
                }
            })
            .map(d => {
                this.page = new Page();
                this.page.size = 10;
                this.page.pageNumber = skip;
                this.page.totalElements = d.total;
                this.page.totalPages = this.page.totalElements / this.page.size;
                d.page = this.page;
                return d;
            });
    }

    deleteStockItem$(id) {
        if (id === '') {
            return;
        }

        this.feathers
            .service('warehouse/stock-items')
            .remove(id)
    }
    //end feathers API
}
