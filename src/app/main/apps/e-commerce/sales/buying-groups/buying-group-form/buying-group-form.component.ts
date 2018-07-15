import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';

import { BuyingGroup } from '../buying-groups.model';

@Component({
  selector: 'px-buying-group-form',
  templateUrl: './buying-group-form.component.html',
  styleUrls: ['./buying-group-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BuyingGroupFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  buyingGroupForm: FormGroup;
  action: string;
  buyingGroup: BuyingGroup;

  constructor(
    public dialogRef: MatDialogRef<BuyingGroupFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Buying Group';
      this.buyingGroup = data.buyingGroup;
    }
    else {
      this.dialogTitle = 'New Buying Group';
      this.buyingGroup = new BuyingGroup({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }

    this.buyingGroupForm = this.createBuyingGroupForm();
  }

  createBuyingGroupForm() {
    return this.formBuilder.group({
      id: [this.buyingGroup.id],
      buyingGroupName: [this.buyingGroup.buyingGroupName],
      lastEditedBy: [this.buyingGroup.lastEditedBy],
      validFrom: [this.buyingGroup.validFrom],
      validTo: [this.buyingGroup.validTo]
    });
  }
}
