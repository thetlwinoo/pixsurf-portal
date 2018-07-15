import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { EcommerceStockItemsService } from '../stock-items.service';

@Component({
  selector: 'px-stockitem-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class PxStockItemSelectedBarComponent {

  selectedStockItems: string[];
  hasSelectedStockItems: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private stockItemsService: EcommerceStockItemsService,
    public dialog: MatDialog
  ) {
    this.stockItemsService.onSelectedStockItemsChanged
      .subscribe(selectedStockItems => {
        this.selectedStockItems = selectedStockItems;
        setTimeout(() => {
          this.hasSelectedStockItems = selectedStockItems.length > 0;
          this.isIndeterminate = (selectedStockItems.length !== this.stockItemsService.stockItems.length && selectedStockItems.length > 0);
        }, 0);
      });

  }

  selectAll() {
    this.stockItemsService.selectStockItems();
  }

  deselectAll() {
    this.stockItemsService.deselectStockItems();
  }

  deleteSelectedStockItems() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected stockItems?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stockItemsService.deleteSelectedStockItems();
      }
      this.confirmDialogRef = null;
    });
  }
}
