import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { EcommerceSuppliersService } from '../suppliers.service';

@Component({
  selector: 'px-supplier-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class PxSupplierSelectedBarComponent {

  selectedSuppliers: string[];
  hasSelectedSuppliers: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private suppliersService: EcommerceSuppliersService,
    public dialog: MatDialog
  ) {
    this.suppliersService.onSelectedSupplierChanged
      .subscribe(selectedSuppliers => {
        this.selectedSuppliers = selectedSuppliers;
        setTimeout(() => {
          this.hasSelectedSuppliers = selectedSuppliers.length > 0;
          this.isIndeterminate = (selectedSuppliers.length !== this.suppliersService.suppliers.length && selectedSuppliers.length > 0);
        }, 0);
      });

  }

  selectAll() {
    this.suppliersService.selectSuppliers();
  }

  deselectAll() {
    this.suppliersService.deselectSuppliers();
  }

  deleteSelectedSuppliers() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected suppliers?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.suppliersService.deleteSelectedSuppliers();
      }
      this.confirmDialogRef = null;
    });
  }
}
