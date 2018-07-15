import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';

import { CustomerCategory } from '../customer-categories.model';

@Component({
  selector: 'px-customer-category-form',
  templateUrl: './customer-category-form.component.html',
  styleUrls: ['./customer-category-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerCategoryFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  customerCategoryForm: FormGroup;
  action: string;
  customerCategory: CustomerCategory;

  constructor(
    public dialogRef: MatDialogRef<CustomerCategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Customer Category';
      this.customerCategory = data.customerCategory;
    }
    else {
      this.dialogTitle = 'New Customer Category';
      this.customerCategory = new CustomerCategory({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }

    this.customerCategoryForm = this.createCustomerCategoryForm();
  }

  createCustomerCategoryForm() {
    return this.formBuilder.group({
      id: [this.customerCategory.id],
      customerCategoryName: [this.customerCategory.customerCategoryName],
      lastEditedBy: [this.customerCategory.lastEditedBy],
      validFrom: [this.customerCategory.validFrom],
      validTo: [this.customerCategory.validTo]
    });
  }
}
