import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { LanguageFormComponent } from '../language-form/language-form.component';
import { LanguagesService } from '../languages.service';

@Component({
  selector: 'px-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LanguageListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() stateProvinces;

  languages: any;  
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'languageCode', 'languageName', 'lastEditedBy'];
  selectedLanguages: any[];
  checkboxes: {};

  onLanguagesChangedSubscription: Subscription;  
  onSelectedLanguagesChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private languagesService: LanguagesService,
    public dialog: MatDialog
  ) {
    this.onLanguagesChangedSubscription =
      this.languagesService.onLanguagesChanged.subscribe(languages => {
        this.languages = languages;

        this.checkboxes = {};
        languages.map(language => {
          this.checkboxes[language.id] = false;
        });
      });

    this.onSelectedLanguagesChangedSubscription =
      this.languagesService.onSelectedLanguagesChanged.subscribe(selectedLanguages => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedLanguages.includes(id);
        }
        this.selectedLanguages = selectedLanguages;
      });

    this.onUserDataChangedSubscription =
      this.languagesService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });    

  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.languagesService);
  }

  ngOnDestroy() {
    this.onLanguagesChangedSubscription.unsubscribe();
    this.onSelectedLanguagesChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editLanguage(language) {
    this.dialogRef = this.dialog.open(LanguageFormComponent, {
      panelClass: 'language-form-dialog',
      data: {
        language: language,        
        stateProvinces: this.stateProvinces,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        switch (actionType) {
          /**
           * Save
           */
          case 'save':            
            this.languagesService.updateLanguage(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteLanguage(language);

            break;
        }
      });
  }

  /**
   * Delete Language
   */
  deleteLanguage(language) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.languagesService.deleteLanguage(language);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(languageId) {
    this.languagesService.toggleSelectedLanguage(languageId);
  }

  toggleStar(languageId) {
    if (this.user.starred.includes(languageId)) {
      this.user.starred.splice(this.user.starred.indexOf(languageId), 1);
    }
    else {
      this.user.starred.push(languageId);
    }

    // this.languagesService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private languagesService: LanguagesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.languagesService.onLanguagesChanged;
  }

  disconnect() {
  }
}

