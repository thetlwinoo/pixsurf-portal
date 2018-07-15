import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { DeliveryMethodsService } from '../delivery-methods.service';

@Component({
  selector: 'px-delivery-method-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class DeliveryMethodSelectedBarComponent {

  selectedDeliveryMethods: string[];
  hasSelectedDeliveryMethods: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private deliveryMethodsService: DeliveryMethodsService,
    public dialog: MatDialog
  ) {
    this.deliveryMethodsService.onSelectedDeliveryMethodsChanged
      .subscribe(selectedDeliveryMethods => {
        this.selectedDeliveryMethods = selectedDeliveryMethods;
        setTimeout(() => {
          this.hasSelectedDeliveryMethods = selectedDeliveryMethods.length > 0;
          this.isIndeterminate = (selectedDeliveryMethods.length !== this.deliveryMethodsService.deliveryMethods.length && selectedDeliveryMethods.length > 0);
        }, 0);
      });

  }

  selectAll() {
    this.deliveryMethodsService.selectDeliveryMethods();
  }

  deselectAll() {
    this.deliveryMethodsService.deselectDeliveryMethods();
  }

  deleteSelectedDeliveryMethods() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected state provinces?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deliveryMethodsService.deleteSelectedDeliveryMethods();
      }
      this.confirmDialogRef = null;
    });
  }

}
