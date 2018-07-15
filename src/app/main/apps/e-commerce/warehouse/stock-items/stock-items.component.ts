import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { EcommerceStockItemsService } from './stock-items.service';

import { PagedData } from '@fuse/models/paged-data.model';
import { Page } from '@fuse/models/page.model';
import { Router } from '@angular/router';

@Component({
    selector: 'px-e-commerce-stockItems',
    templateUrl: './stock-items.component.html',
    styleUrls: ['./stock-items.component.scss'],
    animations: fuseAnimations
})
export class PxEcommerceStockItemsComponent implements OnInit {
    stockItems: any;
    selectedStockItems: any[];
    hasSelectedStockItems: boolean;

    // dataSource: FilesDataSource | null;
    // displayedColumns = ['checkbox', 'stockItemName', 'unitPrice', 'recommendedRetailPrice', 'typicalWeightPerUnit'];
    page = new Page();
    rows = new Array<any>();
    displayedColumns = [{ name: 'stockItemName' }, { name: 'unitPrice' }, { name: 'recommendedRetailPrice' }, { name: 'typicalWeightPerUnit' }];
    // checkboxes: {};

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    onStockItemsChangedSubscription: Subscription;
    onSelectedStockItemsChangedSubscription: Subscription;
    selected = [];

    constructor(
        private stockItemsService: EcommerceStockItemsService,
        private _Router: Router,
    ) {
        this.onStockItemsChangedSubscription =
            // this.stockItemsService.onStockItemsChanged.subscribe(stockItems => {

            //     this.stockItems = stockItems;

            //     this.checkboxes = {};
            //     stockItems.map(stockItem => {
            //         this.checkboxes[stockItem.id] = false;
            //     });
            // });
            this.stockItemsService.onStockItemsChanged.subscribe(pagedData => {
                this.page = pagedData.page;
                this.rows = pagedData.data;
            });

        this.onSelectedStockItemsChangedSubscription =
            this.stockItemsService.onSelectedStockItemsChanged.subscribe(selectedStockItems => {
                this.hasSelectedStockItems = selectedStockItems.length > 0;

                // for (const id in this.checkboxes) {
                //     if (!this.checkboxes.hasOwnProperty(id)) {
                //         continue;
                //     }

                //     this.checkboxes[id] = selectedStockItems.includes(id);
                // }
                this.selectedStockItems = selectedStockItems;
            });

        this.page.pageNumber = 0;
        this.page.size = 10;
    }

    ngOnInit() {
        // this.dataSource = new FilesDataSource(this.stockItemsService, this.paginator, this.sort);
        // Observable.fromEvent(this.filter.nativeElement, 'keyup')
        //     .debounceTime(150)
        //     .distinctUntilChanged()
        //     .subscribe(() => {
        //         if (!this.dataSource) {
        //             return;
        //         }
        //         this.dataSource.filter = this.filter.nativeElement.value;
        //     });
        // this.setPage({ offset: 0 });
    }

    onSelectedChange(id) {
        this.stockItemsService.toggleSelectedStockItem(id);
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;

        this.stockItemsService.getStockItems(this.page.pageNumber);
    }

    onSelect(event) {
        this._Router.navigate(['/apps/e-commerce/warehouse/stock-items/' + event.selected[0]._id]);
    }

    onActivate(event) {
        if (event.type == 'click') {
            // this._Router.navigate(['/apps/e-commerce/warehouse/stock-items/'+event.row._id]);            
        }
    }
}

// export class FilesDataSource extends DataSource<any>
// {
//     _filterChange = new BehaviorSubject('');
//     _filteredDataChange = new BehaviorSubject('');

//     get filteredData(): any {
//         return this._filteredDataChange.value;
//     }

//     set filteredData(value: any) {
//         this._filteredDataChange.next(value);
//     }

//     get filter(): string {
//         return this._filterChange.value;
//     }

//     set filter(filter: string) {
//         this._filterChange.next(filter);
//     }

//     constructor(
//         private stockItemsService: EcommerceStockItemsService,
//         private _paginator: MatPaginator,
//         private _sort: MatSort
//     ) {
//         super();
//         this.filteredData = this.stockItemsService.stockItems;
//     }

//     /** Connect function called by the table to retrieve one stream containing the data to render. */
//     connect(): Observable<any[]> {
//         const displayDataChanges = [
//             this.stockItemsService.onStockItemsChanged,
//             this._paginator.page,
//             this._filterChange,
//             this._sort.sortChange
//         ];

//         return Observable.merge(...displayDataChanges).map(() => {
//             let data = this.stockItemsService.stockItems.slice();

//             data = this.filterData(data);

//             this.filteredData = [...data];

//             data = this.sortData(data);

//             // Grab the page's slice of data.
//             const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
//             return data.splice(startIndex, this._paginator.pageSize);
//         });
//     }

//     filterData(data) {
//         if (!this.filter) {
//             return data;
//         }
//         return FuseUtils.filterArrayByString(data, this.filter);
//     }

//     sortData(data): any[] {
//         if (!this._sort.active || this._sort.direction === '') {
//             return data;
//         }

//         return data.sort((a, b) => {
//             let propertyA: number | string = '';
//             let propertyB: number | string = '';

//             switch (this._sort.active) {
//                 case 'stockItemName':
//                     [propertyA, propertyB] = [a.stockItemName, b.stockItemName];
//                     break;
//                 case 'unitPrice':
//                     [propertyA, propertyB] = [a.unitPrice, b.unitPrice];
//                     break;
//                 case 'recommendedRetailPrice':
//                     [propertyA, propertyB] = [a.recommendedRetailPrice, b.recommendedRetailPrice];
//                     break;
//                 case 'typicalWeightPerUnit':
//                     [propertyA, propertyB] = [a.typicalWeightPerUnit, b.typicalWeightPerUnit];
//                     break;
//             }

//             const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//             const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//             return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
//         });
//     }

//     disconnect() {
//     }
// }
