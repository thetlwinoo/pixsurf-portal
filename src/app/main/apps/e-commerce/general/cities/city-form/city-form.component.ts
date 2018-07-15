import { Component, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';
import { StateProvincesService } from '../../state-provinces/state-provinces.service';
import { City } from '../city.model';

@Component({
  selector: 'px-city-form',
  templateUrl: './city-form.component.html',
  styleUrls: ['./city-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CityFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  cityForm: FormGroup;
  action: string;
  city: City;
  stateProvinces: any;

  selectedStateProvinceId: string;

  constructor(
    public dialogRef: MatDialogRef<CityFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private stateProvinceService: StateProvincesService,
  ) {
    this.action = data.action;
    this.stateProvinces = data.stateProvinces;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit City';
      this.city = data.city;
      this.selectedStateProvinceId = this.city.stateProvinceID._id;
    }
    else {
      this.dialogTitle = 'New City';
      this.city = new City({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }
    this.cityForm = this.createCityForm();
  }

  createCityForm() {    
    return this.formBuilder.group({
      id: [this.city.id],
      cityName: [this.city.cityName],
      stateProvinceID: [this.city.stateProvinceID],
      location: [this.city.location],
      latestRecordedPopulation: [this.city.latestRecordedPopulation],
      lastEditedBy: [this.city.lastEditedBy],
      validFrom: [this.city.validFrom],
      validTo: [this.city.validTo]
    });
  }

  onStateProvinceChanged(event?) {
    if(event){      
      this.cityForm.value.stateProvinceID = event;
    }    
  }
}
