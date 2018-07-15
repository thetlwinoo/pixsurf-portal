import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { AddressTypeFormComponent } from '../address-type-form/address-type-form.component';
import { AddressTypesService } from '../address-types.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'px-address-type-list',
  templateUrl: './address-type-list.component.html',
  styleUrls: ['./address-type-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddressTypeListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() countries;

  addressTypes: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'addressTypeName', 'lastEditedBy'];
  selectedAddressTypes: any[];
  checkboxes: {};

  onAddressTypesChangedSubscription: Subscription;
  onSelectedAddressTypesChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private addressTypesService: AddressTypesService,
    public dialog: MatDialog
  ) {
    this.onAddressTypesChangedSubscription =
      this.addressTypesService.onAddressTypesChanged.subscribe(addressTypes => {
        this.addressTypes = addressTypes;

        this.checkboxes = {};
        addressTypes.map(addressType => {
          this.checkboxes[addressType.id] = false;
        });
      });

    this.onSelectedAddressTypesChangedSubscription =
      this.addressTypesService.onSelectedAddressTypesChanged.subscribe(selectedAddressTypes => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedAddressTypes.includes(id);
        }
        this.selectedAddressTypes = selectedAddressTypes;
      });

    this.onUserDataChangedSubscription =
      this.addressTypesService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.addressTypesService);
  }

  ngOnDestroy() {
    this.onAddressTypesChangedSubscription.unsubscribe();
    this.onSelectedAddressTypesChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editAddressType(addressType) {
    this.dialogRef = this.dialog.open(AddressTypeFormComponent, {
      panelClass: 'address-type-form-dialog',
      data: {
        addressType: addressType,
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

            this.addressTypesService.updateAddressType(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteAddressType(addressType);

            break;
        }
      });
  }

  /**
   * Delete AddressTypes
   */
  deleteAddressType(addressType) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addressTypesService.deleteAddressType(addressType);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(addressTypeId) {
    this.addressTypesService.toggleSelectedAddressType(addressTypeId);
  }

  toggleStar(addressTypeId) {
    if (this.user.starred.includes(addressTypeId)) {
      this.user.starred.splice(this.user.starred.indexOf(addressTypeId), 1);
    }
    else {
      this.user.starred.push(addressTypeId);
    }

    // this.addressTypesService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private addressTypesService: AddressTypesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.addressTypesService.onAddressTypesChanged;
  }

  disconnect() {
  }
}

