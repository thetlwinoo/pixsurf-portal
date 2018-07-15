import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { LanguageFormComponent } from './language-form/language-form.component';
import { LanguagesService } from './languages.service';

@Component({
    selector: 'px-languages',
    templateUrl: './languages.component.html',
    styleUrls: ['./languages.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LanguagesComponent implements OnInit, OnDestroy {

    hasSelectedLanguages: boolean;
    searchInput: FormControl;
    dialogRef: any;
    onSelectedLanguagesChangedSubscription: Subscription;

    constructor(
        private languagesService: LanguagesService,
        public dialog: MatDialog
    ) {
        this.searchInput = new FormControl('');
    }

    newLanguage() {
        this.dialogRef = this.dialog.open(LanguageFormComponent, {
            panelClass: 'language-form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this.languagesService.addLanguage(response.getRawValue());
            });
    }

    ngOnInit() {
        this.onSelectedLanguagesChangedSubscription =
            this.languagesService.onSelectedLanguagesChanged
                .subscribe(selectedLanguages => {
                    this.hasSelectedLanguages = selectedLanguages.length > 0;
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.languagesService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
        this.onSelectedLanguagesChangedSubscription.unsubscribe();
    }

}
