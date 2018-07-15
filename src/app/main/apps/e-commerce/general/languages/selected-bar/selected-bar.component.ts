import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { LanguagesService } from '../languages.service';

@Component({
  selector: 'px-language-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class LanguageSelectedBarComponent {

  selectedLanguages: string[];
    hasSelectedLanguages: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private languagesService: LanguagesService,
        public dialog: MatDialog
    )
    {
        this.languagesService.onSelectedLanguagesChanged
            .subscribe(selectedLanguages => {
                this.selectedLanguages = selectedLanguages;
                setTimeout(() => {
                    this.hasSelectedLanguages = selectedLanguages.length > 0;
                    this.isIndeterminate = (selectedLanguages.length !== this.languagesService.languages.length && selectedLanguages.length > 0);
                }, 0);
            });

    }

    selectAll()
    {
        this.languagesService.selectLanguages();
    }

    deselectAll()
    {
        this.languagesService.deselectLanguages();
    }

    deleteSelectedLanguages()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected languages?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.languagesService.deleteSelectedLanguages();
            }
            this.confirmDialogRef = null;
        });
    }

}
