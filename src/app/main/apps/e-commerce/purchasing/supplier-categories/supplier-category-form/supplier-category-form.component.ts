import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';

import { SupplierCategory } from '../supplier-categories.model';

@Component({
  selector: 'px-supplier-category-form',
  templateUrl: './supplier-category-form.component.html',
  styleUrls: ['./supplier-category-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SupplierCategoryFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  supplierCategoryForm: FormGroup;
  action: string;
  supplierCategory: SupplierCategory;

  constructor(
    public dialogRef: MatDialogRef<SupplierCategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
    this.action = data.action;

    if (this.action === 'edit') { 
      this.dialogTitle = 'Edit SupplierCategory';
      this.supplierCategory = data.supplierCategory;
    }
    else {
      this.dialogTitle = 'New SupplierCategory';
      this.supplierCategory = new SupplierCategory({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }

    this.supplierCategoryForm = this.createSupplierCategoryForm();
  }

  createSupplierCategoryForm() {
    return this.formBuilder.group({
      id: [this.supplierCategory.id],
      supplierCategoryName: [this.supplierCategory.supplierCategoryName],
      lastEditedBy: [this.supplierCategory.lastEditedBy],
      validFrom: [this.supplierCategory.validFrom],
      validTo: [this.supplierCategory.validTo]
    });
  }
}
