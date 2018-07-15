import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { AddressFormComponent } from '../address-form/address-form.component';
import { AddressesService } from '../addresses.service';

@Component({
  selector: 'px-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddressListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() stateProvinces;
  @Input() cities;
  @Input() countries;
  @Input() addressTypes;

  addresses: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'addressType', 'addressLine1', 'addressLine2', 'city', 'stateProvince', 'country', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedAddresses: any[];
  checkboxes: {};

  onAddressesChangedSubscription: Subscription;
  onSelectedAddressesChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private addressesService: AddressesService,
    public dialog: MatDialog
  ) {
    this.onAddressesChangedSubscription =
      this.addressesService.onAddressesChanged.subscribe(addresses => {
        this.addresses = addresses;

        this.checkboxes = {};
        addresses.map(address => {
          this.checkboxes[address.id] = false;
        });
      });

    this.onSelectedAddressesChangedSubscription =
      this.addressesService.onSelectedAddressesChanged.subscribe(selectedAddresses => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedAddresses.includes(id);
        }
        this.selectedAddresses = selectedAddresses;
      });

    this.onUserDataChangedSubscription =
      this.addressesService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });

  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.addressesService);
  }

  ngOnDestroy() {
    this.onAddressesChangedSubscription.unsubscribe();
    this.onSelectedAddressesChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editAddress(address) {
    this.dialogRef = this.dialog.open(AddressFormComponent, {
      panelClass: 'address-form-dialog',
      data: {
        address: address,
        stateProvinces: this.stateProvinces,
        cities: this.cities,
        addressTypes: this.addressTypes,
        countries: this.countries,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        switch (actionType) {
          /**
           * Save
           */
          case 'save':
            this.addressesService.updateAddress(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteAddress(address);

            break;
        }
      });
  }

  /**
   * Delete Address
   */
  deleteAddress(address) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addressesService.deleteAddress(address);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(addressId) {
    this.addressesService.toggleSelectedAddress(addressId);
  }

  toggleStar(addressId) {
    if (this.user.starred.includes(addressId)) {
      this.user.starred.splice(this.user.starred.indexOf(addressId), 1);
    }
    else {
      this.user.starred.push(addressId);
    }

    // this.addressesService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private addressesService: AddressesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.addressesService.onAddressesChanged;
  }

  disconnect() {
  }
}

