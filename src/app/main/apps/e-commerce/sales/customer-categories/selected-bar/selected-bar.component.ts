import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { CustomerCategoriesService } from '../customer-categories.service';

@Component({
  selector: 'px-customer-category-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class CustomerCategorySelectedBarComponent {

  selectedCustomerCategories: string[];
  hasSelectedCustomerCategories: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private customerCategoriesService: CustomerCategoriesService,
    public dialog: MatDialog
  ) {
    this.customerCategoriesService.onSelectedCustomerCategoriesChanged
      .subscribe(selectedCustomerCategories => {
        this.selectedCustomerCategories = selectedCustomerCategories;
        setTimeout(() => {
          this.hasSelectedCustomerCategories = selectedCustomerCategories.length > 0;
          this.isIndeterminate = (selectedCustomerCategories.length !== this.customerCategoriesService.customerCategories.length && selectedCustomerCategories.length > 0);
        }, 0);
      });

  }

  selectAll() {
    this.customerCategoriesService.selectCustomerCategories();
  }

  deselectAll() {
    this.customerCategoriesService.deselectCustomerCategories();
  }

  deleteSelectedCustomerCategories() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected state provinces?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerCategoriesService.deleteSelectedCustomerCategories();
      }
      this.confirmDialogRef = null;
    });
  }

}
