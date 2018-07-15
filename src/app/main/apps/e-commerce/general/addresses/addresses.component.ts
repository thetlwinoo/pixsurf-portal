import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { AddressFormComponent } from './address-form/address-form.component';
import { AddressesService } from './addresses.service';

@Component({
  selector: 'px-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AddressesComponent implements OnInit, OnDestroy {

  hasSelectedAddresses: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedAddressesChangedSubscription: Subscription;

  stateProvinces: any;
  onStateProvinceChangedSubscription: Subscription;

  addressTypes: any;
  onAddressTypeChangedSubscription: Subscription;

  cities: any;
  onCityChangedSubscription: Subscription;

  countries: any;
  onCountriesChangedSubscription: Subscription;

  constructor(
    private addressesService: AddressesService,
    public dialog: MatDialog
  ) {
    this.searchInput = new FormControl('');

    this.onStateProvinceChangedSubscription =
      this.addressesService.onStateProvinceChanged.subscribe(stateProvinces => {
        this.stateProvinces = stateProvinces;
      });

    this.onCityChangedSubscription =
      this.addressesService.onCityChanged.subscribe(cities => {
        this.cities = cities;
      });

    this.onAddressTypeChangedSubscription =
      this.addressesService.onAddressTypeChanged.subscribe(addressTypes => {
        this.addressTypes = addressTypes;
      });

    this.onCountriesChangedSubscription =
      this.addressesService.onCountryChanged.subscribe(countries => {
        this.countries = countries;
      });
  }

  newAddress() {
    this.dialogRef = this.dialog.open(AddressFormComponent, {
      panelClass: 'address-form-dialog',
      data: {
        action: 'new',
        stateProvinces: this.stateProvinces
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }

        this.addressesService.addAddress(response.getRawValue());
      });
  }

  ngOnInit() {
    this.onSelectedAddressesChangedSubscription =
      this.addressesService.onSelectedAddressesChanged
        .subscribe(selectedAddresses => {
          this.hasSelectedAddresses = selectedAddresses.length > 0;
        });

    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.addressesService.onSearchTextChanged.next(searchText);
      });
  }

  ngOnDestroy() {
    this.onSelectedAddressesChangedSubscription.unsubscribe();
    this.onStateProvinceChangedSubscription.unsubscribe();
    this.onAddressTypeChangedSubscription.unsubscribe();
    this.onCityChangedSubscription.unsubscribe();
    this.onCountriesChangedSubscription.unsubscribe();
  }

}
