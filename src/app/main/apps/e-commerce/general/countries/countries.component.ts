import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { CountryFormComponent } from './country-form/country-form.component';
import { CountriesService } from './countries.service';

@Component({
    selector: 'px-countries',
    templateUrl: './countries.component.html',
    styleUrls: ['./countries.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CountriesComponent implements OnInit, OnDestroy {

    hasSelectedCountries: boolean;
    searchInput: FormControl;
    dialogRef: any;
    onSelectedCountriesChangedSubscription: Subscription;

    constructor(        
        private countriesService: CountriesService,
        public dialog: MatDialog
    ) {
        this.searchInput = new FormControl('');        
    }

    newCountry() {
        this.dialogRef = this.dialog.open(CountryFormComponent, {
            panelClass: 'country-form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this.countriesService.addCountry(response.getRawValue());
            });
    }

    ngOnInit() {
        this.onSelectedCountriesChangedSubscription =
            this.countriesService.onSelectedCountriesChanged
                .subscribe(selectedCountries => {
                    this.hasSelectedCountries = selectedCountries.length > 0;
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.countriesService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
        this.onSelectedCountriesChangedSubscription.unsubscribe();
    }

}
