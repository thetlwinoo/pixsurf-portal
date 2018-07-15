import { Component, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CalendarEvent } from 'angular-calendar';
import { Language } from '../language.model';

@Component({
  selector: 'px-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LanguageFormComponent {

  event: CalendarEvent;
  dialogTitle: string;
  languageForm: FormGroup;
  action: string;
  language: Language;

  constructor(
    public dialogRef: MatDialogRef<LanguageFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
  ) {
    this.action = data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Language';
      this.language = data.language;      
    }
    else {
      this.dialogTitle = 'New Language';
      this.language = new Language({});
    }
    this.languageForm = this.createLanguageForm();
  }

  createLanguageForm() {    
    return this.formBuilder.group({
      id: [this.language.id],
      languageCode: [this.language.languageCode],
      languageName: [this.language.languageName],
      lastEditedBy: [this.language.lastEditedBy],
    });
  }
}
