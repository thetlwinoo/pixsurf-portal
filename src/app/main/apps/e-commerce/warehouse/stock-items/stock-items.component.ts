import { Component, ElementRef, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
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
export class PxEcommerceStockItemsComponent implements OnInit, OnDestroy {
    @ViewChild('editTmpl') editTmpl: TemplateRef<any>;
    @ViewChild('hdrTpl') hdrTpl: TemplateRef<any>;
    stockItems: any;
    selectedStockItems: any[];
    hasSelectedStockItems: boolean;

    page = new Page();
    rows = new Array<any>();
    displayedColumns: any[];
    // checkboxes: {};

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MatSort) sort: MatSort;

    onStockItemsChangedSubscription: Subscription;
    onPageChangedSubscription: Subscription;
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
                console.log(pagedData.data)
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
        console.log('init')
        // this.setPage({ offset: 0 });
        this.displayedColumns = [{ cellTemplate: this.editTmpl, name: 'preview', flexGrow: 1 }, { name: 'stockItemName', flexGrow: 3 }, { name: 'unitPrice', flexGrow: 1 }, { name: 'recommendedRetailPrice', flexGrow: 1 }];
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

    ngOnDestroy() {
        if (this.onStockItemsChangedSubscription) this.onStockItemsChangedSubscription.unsubscribe();
        if (this.onPageChangedSubscription) this.onPageChangedSubscription.unsubscribe();
        if (this.onSelectedStockItemsChangedSubscription) this.onSelectedStockItemsChangedSubscription.unsubscribe();
    }
}
