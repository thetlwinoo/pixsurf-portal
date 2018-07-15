import { Component, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';
import { PackageType } from '../package-type.model';

@Component({
  selector: 'px-package-type-form',
  templateUrl: './package-type-form.component.html',
  styleUrls: ['./package-type-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PackageTypeFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  packageTypeForm: FormGroup;
  action: string;
  packageType: PackageType;
  
  constructor(
    public dialogRef: MatDialogRef<PackageTypeFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit PackageType';
      this.packageType = data.packageType;      
    }
    else {
      this.dialogTitle = 'New PackageType';
      this.packageType = new PackageType({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }
    this.packageTypeForm = this.createPackageTypeForm();
  }

  createPackageTypeForm() {    
    return this.formBuilder.group({
      id: [this.packageType.id],      
      packageTypeName: [this.packageType.packageTypeName],
      lastEditedBy: [this.packageType.lastEditedBy],
      validFrom: [this.packageType.validFrom],
      validTo: [this.packageType.validTo]
    });
  }
}
