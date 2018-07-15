import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { StockGroupFormComponent } from './stock-group-form/stock-group-form.component';
import { StockGroupsService } from './stock-groups.service';

@Component({
    selector: 'px-stock-groups',
    templateUrl: './stock-groups.component.html',
    styleUrls: ['./stock-groups.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class StockGroupsComponent implements OnInit, OnDestroy {

    hasSelectedStockGroups: boolean;
    searchInput: FormControl;
    dialogRef: any;
    onSelectedStockGroupsChangedSubscription: Subscription;

    constructor(
        private stockGroupsService: StockGroupsService,
        public dialog: MatDialog
    ) {
        this.searchInput = new FormControl('');
    }

    newStockGroup() {
        this.dialogRef = this.dialog.open(StockGroupFormComponent, {
            panelClass: 'stock-group-form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this.stockGroupsService.addStockGroup(response.getRawValue());
            });
    }

    ngOnInit() {
        this.onSelectedStockGroupsChangedSubscription =
            this.stockGroupsService.onSelectedStockGroupsChanged
                .subscribe(selectedStockGroups => {
                    this.hasSelectedStockGroups = selectedStockGroups.length > 0;
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.stockGroupsService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
        this.onSelectedStockGroupsChangedSubscription.unsubscribe();
    }

}
