import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { CountriesService } from '../countries.service';

@Component({
  selector: 'px-country-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class CountrySelectedBarComponent {

  selectedCountries: string[];
    hasSelectedCountries: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private countriesService: CountriesService,
        public dialog: MatDialog
    )
    {
        this.countriesService.onSelectedCountriesChanged
            .subscribe(selectedCountries => {
                this.selectedCountries = selectedCountries;
                setTimeout(() => {
                    this.hasSelectedCountries = selectedCountries.length > 0;
                    this.isIndeterminate = (selectedCountries.length !== this.countriesService.countries.length && selectedCountries.length > 0);
                }, 0);
            });

    }

    selectAll()
    {
        this.countriesService.selectCountries();
    }

    deselectAll()
    {
        this.countriesService.deselectCountries();
    }

    deleteSelectedCountries()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected countries?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.countriesService.deleteSelectedCountries();
            }
            this.confirmDialogRef = null;
        });
    }

}
