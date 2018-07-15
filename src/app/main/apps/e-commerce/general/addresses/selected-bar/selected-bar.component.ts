import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { AddressesService } from '../addresses.service';

@Component({
  selector: 'px-address-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class AddressSelectedBarComponent {

  selectedAddresses: string[];
    hasSelectedAddresses: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private addressesService: AddressesService,
        public dialog: MatDialog
    )
    {
        this.addressesService.onSelectedAddressesChanged
            .subscribe(selectedAddresses => {
                this.selectedAddresses = selectedAddresses;
                setTimeout(() => {
                    this.hasSelectedAddresses = selectedAddresses.length > 0;
                    this.isIndeterminate = (selectedAddresses.length !== this.addressesService.addresses.length && selectedAddresses.length > 0);
                }, 0);
            });

    }

    selectAll()
    {
        this.addressesService.selectAddresses();
    }

    deselectAll()
    {
        this.addressesService.deselectAddresses();
    }

    deleteSelectedAddresses()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected addresses?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.addressesService.deleteSelectedAddresses();
            }
            this.confirmDialogRef = null;
        });
    }

}
