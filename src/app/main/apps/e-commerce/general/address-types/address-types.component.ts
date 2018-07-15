import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { AddressTypeFormComponent } from './address-type-form/address-type-form.component';
import { AddressTypesService } from './address-types.service';

@Component({
  selector: 'px-address-types',
  templateUrl: './address-types.component.html',
  styleUrls: ['./address-types.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddressTypesComponent implements OnInit, OnDestroy {

  hasSelectedAddressTypes: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedAddressTypesChangedSubscription: Subscription;

  constructor(
    private addressTypesService: AddressTypesService,
    public dialog: MatDialog
  ) {
    this.searchInput = new FormControl('');
  }

  newAddressType() {
    this.dialogRef = this.dialog.open(AddressTypeFormComponent, {
      panelClass: 'address-type-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }

        this.addressTypesService.addAddressType(response.getRawValue());
      });
  }

  ngOnInit() {
    this.onSelectedAddressTypesChangedSubscription =
      this.addressTypesService.onSelectedAddressTypesChanged
        .subscribe(selectedAddressTypes => {
          this.hasSelectedAddressTypes = selectedAddressTypes.length > 0;
        });

    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.addressTypesService.onSearchTextChanged.next(searchText);
      });
  }

  ngOnDestroy() {
    this.onSelectedAddressTypesChangedSubscription.unsubscribe();
  }

}
