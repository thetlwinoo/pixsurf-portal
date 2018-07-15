import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { AddressTypesService } from '../address-types.service';

@Component({
  selector: 'px-address-type-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class AddressTypeSelectedBarComponent {

  selectedAddressTypes: string[];
  hasSelectedAddressTypes: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private addressTypesService: AddressTypesService,
    public dialog: MatDialog
  ) {
    this.addressTypesService.onSelectedAddressTypesChanged
      .subscribe(selectedAddressTypes => {
        this.selectedAddressTypes = selectedAddressTypes;
        setTimeout(() => {
          this.hasSelectedAddressTypes = selectedAddressTypes.length > 0;
          this.isIndeterminate = (selectedAddressTypes.length !== this.addressTypesService.addressTypes.length && selectedAddressTypes.length > 0);
        }, 0);
      });

  }

  selectAll() {
    this.addressTypesService.selectAddressTypes();
  }

  deselectAll() {
    this.addressTypesService.deselectAddressTypes();
  }

  deleteSelectedAddressTypes() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected state provinces?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addressTypesService.deleteSelectedAddressTypes();
      }
      this.confirmDialogRef = null;
    });
  }

}
