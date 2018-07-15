import { Component, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';
import { Color } from '../color.model';

@Component({
  selector: 'px-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ColorFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  colorForm: FormGroup;
  action: string;
  color: Color;

  constructor(
    public dialogRef: MatDialogRef<ColorFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Color';
      this.color = data.color;
    }
    else {
      this.dialogTitle = 'New Color';
      this.color = new Color({
        validFrom: new Date('2018-01-01 00:00:00.0000000'),
        validTo: new Date('9999-12-31 23:59:59.9999999')
      });
    }
    this.colorForm = this.createColorForm();
  }

  createColorForm() {
    return this.formBuilder.group({
      id: [this.color.id],
      colorCode: [this.color.colorCode],
      colorName: [this.color.colorName],
      lastEditedBy: [this.color.lastEditedBy],
      validFrom: [this.color.validFrom],
      validTo: [this.color.validTo]
    });
  }
}
