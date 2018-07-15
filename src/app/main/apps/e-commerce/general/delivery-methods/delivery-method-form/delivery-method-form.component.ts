import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';

import { DeliveryMethod } from '../delivery-methods.model';

@Component({
  selector: 'px-delivery-method-form',
  templateUrl: './delivery-method-form.component.html',
  styleUrls: ['./delivery-method-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryMethodFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  deliveryMethodForm: FormGroup;
  action: string;
  deliveryMethod: DeliveryMethod;

  constructor(
    public dialogRef: MatDialogRef<DeliveryMethodFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit DeliveryMethod';
      this.deliveryMethod = data.deliveryMethod;
    }
    else {
      this.dialogTitle = 'New DeliveryMethod';
      this.deliveryMethod = new DeliveryMethod({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }

    this.deliveryMethodForm = this.createDeliveryMethodForm();
  }

  createDeliveryMethodForm() {
    return this.formBuilder.group({
      id: [this.deliveryMethod.id],
      deliveryMethodName: [this.deliveryMethod.deliveryMethodName],
      lastEditedBy: [this.deliveryMethod.lastEditedBy],
      validFrom: [this.deliveryMethod.validFrom],
      validTo: [this.deliveryMethod.validTo]
    });
  }
}
