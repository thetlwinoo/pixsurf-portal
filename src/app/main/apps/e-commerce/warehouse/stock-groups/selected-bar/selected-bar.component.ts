import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { StockGroupsService } from '../stock-groups.service';

@Component({
  selector: 'px-stock-group-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class StockGroupSelectedBarComponent {

  selectedStockGroups: string[];
    hasSelectedStockGroups: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private stockGroupsService: StockGroupsService,
        public dialog: MatDialog
    )
    {
        this.stockGroupsService.onSelectedStockGroupsChanged
            .subscribe(selectedStockGroups => {
                this.selectedStockGroups = selectedStockGroups;
                setTimeout(() => {
                    this.hasSelectedStockGroups = selectedStockGroups.length > 0;
                    this.isIndeterminate = (selectedStockGroups.length !== this.stockGroupsService.stockGroups.length && selectedStockGroups.length > 0);
                }, 0);
            });

    }

    selectAll()
    {
        this.stockGroupsService.selectStockGroups();
    }

    deselectAll()
    {
        this.stockGroupsService.deselectStockGroups();
    }

    deleteSelectedStockGroups()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected package types?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.stockGroupsService.deleteSelectedStockGroups();
            }
            this.confirmDialogRef = null;
        });
    }

}
