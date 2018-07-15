import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';

import { AddressType } from '../address-types.model';

@Component({
  selector: 'px-address-type-form',
  templateUrl: './address-type-form.component.html',
  styleUrls: ['./address-type-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddressTypeFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  addressTypeForm: FormGroup;
  action: string;
  addressType: AddressType;

  constructor(
    public dialogRef: MatDialogRef<AddressTypeFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit AddressType';
      this.addressType = data.addressType;
    }
    else {
      this.dialogTitle = 'New AddressType';
      this.addressType = new AddressType({});
    }

    this.addressTypeForm = this.createAddressTypeForm();
  }

  createAddressTypeForm() {
    return this.formBuilder.group({
      id: [this.addressType.id],
      addressTypeName: [this.addressType.addressTypeName],
      lastEditedBy: [this.addressType.lastEditedBy]
    });
  }
}
