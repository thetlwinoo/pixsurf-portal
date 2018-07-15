import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { EcommerceCustomersService } from '../customers.service';

@Component({
  selector: 'px-customer-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class PxCustomerSelectedBarComponent {

  selectedCustomers: string[];
  hasSelectedCustomers: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private customersService: EcommerceCustomersService,
    public dialog: MatDialog
  ) {
    this.customersService.onSelectedCustomerChanged
      .subscribe(selectedCustomers => {
        this.selectedCustomers = selectedCustomers;
        setTimeout(() => {
          this.hasSelectedCustomers = selectedCustomers.length > 0;
          this.isIndeterminate = (selectedCustomers.length !== this.customersService.customers.length && selectedCustomers.length > 0);
        }, 0);
      });

  }

  selectAll() {
    this.customersService.selectCustomers();
  }

  deselectAll() {
    this.customersService.deselectCustomers();
  }

  deleteSelectedCustomers() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected customers?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customersService.deleteSelectedCustomers();
      }
      this.confirmDialogRef = null;
    });
  }
}
