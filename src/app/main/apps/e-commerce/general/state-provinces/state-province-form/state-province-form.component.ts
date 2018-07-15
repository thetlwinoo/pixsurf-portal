import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';

import { StateProvince } from '../state-provinces.model';

@Component({
  selector: 'px-state-province-form',
  templateUrl: './state-province-form.component.html',
  styleUrls: ['./state-province-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StateProvinceFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  stateProvinceForm: FormGroup;
  action: string;
  stateProvince: StateProvince;
  countries: any;
  selectedCountryId: string;

  constructor(
    public dialogRef: MatDialogRef<StateProvinceFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;    
    this.countries = data.countries;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit StateProvince';
      this.stateProvince = data.stateProvince;
      this.selectedCountryId = this.stateProvince.countryID._id;
    }
    else {
      this.dialogTitle = 'New StateProvince';
      this.stateProvince = new StateProvince({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }

    this.stateProvinceForm = this.createStateProvinceForm();
  }

  createStateProvinceForm() {
    return this.formBuilder.group({
      id: [this.stateProvince.id],
      stateProvinceCode: [this.stateProvince.stateProvinceCode],
      stateProvinceName: [this.stateProvince.stateProvinceName],
      countryID: [this.stateProvince.countryID],
      salesTerritory: [this.stateProvince.salesTerritory],
      border: [this.stateProvince.border],
      latestRecordedPopulation: [this.stateProvince.latestRecordedPopulation],
      lastEditedBy: [this.stateProvince.lastEditedBy],
      validFrom: [this.stateProvince.validFrom],
      validTo: [this.stateProvince.validTo]
    });
  }

  onCountryChanged(event?) {
    if(event){      
      this.stateProvinceForm.value.countryID = event;
    }    
  }
}
