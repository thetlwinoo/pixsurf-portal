import { Component, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';
import { StockGroup } from '../stock-group.model';

@Component({
  selector: 'px-stock-group-form',
  templateUrl: './stock-group-form.component.html',
  styleUrls: ['./stock-group-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StockGroupFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  stockGroupForm: FormGroup;
  action: string;
  stockGroup: StockGroup;
  
  constructor(
    public dialogRef: MatDialogRef<StockGroupFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit StockGroup';
      this.stockGroup = data.stockGroup;      
    }
    else {
      this.dialogTitle = 'New StockGroup';
      this.stockGroup = new StockGroup({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }
    this.stockGroupForm = this.createStockGroupForm();
  }

  createStockGroupForm() {    
    return this.formBuilder.group({
      id: [this.stockGroup.id],      
      stockGroupName: [this.stockGroup.stockGroupName],
      lastEditedBy: [this.stockGroup.lastEditedBy],
      validFrom: [this.stockGroup.validFrom],
      validTo: [this.stockGroup.validTo]
    });
  }
}
