import { Component, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';
import { StateProvincesService } from '../../state-provinces/state-provinces.service';
import { Address } from '../addresses.model';

@Component({
  selector: 'px-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddressFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  addressForm: FormGroup;
  action: string;
  address: Address;
  stateProvinces: any;
  cities: any;
  countries: any;
  addressTypes: any;

  selectedStateProvinceId: string;
  selectedCityId: string;
  selectedAddressTypeId: string;
  selectedCountryId: string;

  constructor(
    public dialogRef: MatDialogRef<AddressFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private stateProvinceService: StateProvincesService,
  ) {
    this.action = data.action;
    this.stateProvinces = data.stateProvinces;
    this.cities = data.cities;
    this.countries = data.countries;
    this.addressTypes = data.addressTypes;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Address';
      this.address = data.address;

      this.selectedStateProvinceId = this.address.stateProvince._id;
      this.selectedAddressTypeId = this.address.addressType._id;
      this.selectedCityId = this.address.city._id;
      this.selectedCountryId = this.address.country._id;
    }
    else {
      this.dialogTitle = 'New Address';
      this.address = new Address({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }
    this.addressForm = this.createAddressForm();
  }

  createAddressForm() {    
    return this.formBuilder.group({
      id: [this.address.id],
      addressType: [this.address.addressType],
      addressLine1: [this.address.addressLine1],
      addressLine2: [this.address.addressLine2],
      city: [this.address.city],
      stateProvince: [this.address.stateProvince],
      country: [this.address.country],
      geoLocation: [this.address.geoLocation],
      postalCode: [this.address.postalCode],
      lastEditedBy: [this.address.lastEditedBy],
      validFrom: [this.address.validFrom],
      validTo: [this.address.validTo]
    });
  }

  onStateProvinceChanged(event?) {
    if(event){      
      this.addressForm.value.stateProvinceID = event;
    }    
  }

  onCityChanged(event?) {
    if(event){      
      this.addressForm.value.city = event;
    }    
  }

  onAddressTypeChanged(event?) {
    if(event){      
      this.addressForm.value.addressType = event;
    }    
  }

  onCountryChanged(event?) {
    if(event){      
      this.addressForm.value.country = event;
    }    
  }
}
