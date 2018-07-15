import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';

import { Country } from '../country.model';

@Component({
  selector: 'px-country-form',
  templateUrl: './country-form.component.html',
  styleUrls: ['./country-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CountryFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  countryForm: FormGroup;
  action: string;
  country: Country;

  constructor(
    public dialogRef: MatDialogRef<CountryFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Country';
      this.country = data.country;
    }
    else {
      this.dialogTitle = 'New Country';
      this.country = new Country({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }

    this.countryForm = this.createCountryForm();
  }

  createCountryForm() {
    return this.formBuilder.group({
      id: [this.country.id],
      countryName: [this.country.countryName],
      formalName: [this.country.formalName],
      isoAlpha3Code: [this.country.isoAlpha3Code],
      isoNumericCode: [this.country.isoNumericCode],
      countryType: [this.country.countryType],
      latestRecordedPopulation: [this.country.latestRecordedPopulation],
      continent: [this.country.continent],
      region: [this.country.region],
      subregion: [this.country.subregion],
      border: [this.country.border],
      lastEditedBy: [this.country.lastEditedBy],
      validFrom: [this.country.validFrom],
      validTo: [this.country.validTo]
    });
  }

}
