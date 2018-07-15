import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { SupplierCategoriesService } from '../supplier-categories.service';

@Component({
  selector: 'px-supplier-category-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class SupplierCategorySelectedBarComponent {

  selectedSupplierCategories: string[];
  hasSelectedSupplierCategories: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private supplierCategoriesService: SupplierCategoriesService,
    public dialog: MatDialog
  ) {
    this.supplierCategoriesService.onSelectedSupplierCategoriesChanged
      .subscribe(selectedSupplierCategories => {
        this.selectedSupplierCategories = selectedSupplierCategories;
        setTimeout(() => {
          this.hasSelectedSupplierCategories = selectedSupplierCategories.length > 0;
          this.isIndeterminate = (selectedSupplierCategories.length !== this.supplierCategoriesService.supplierCategories.length && selectedSupplierCategories.length > 0);
        }, 0);
      });

  }

  selectAll() {
    this.supplierCategoriesService.selectSupplierCategories();
  }

  deselectAll() {
    this.supplierCategoriesService.deselectSupplierCategories();
  }

  deleteSelectedSupplierCategories() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected state provinces?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supplierCategoriesService.deleteSelectedSupplierCategories();
      }
      this.confirmDialogRef = null;
    });
  }

}
