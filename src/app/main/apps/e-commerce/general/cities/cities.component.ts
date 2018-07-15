import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { CityFormComponent } from './city-form/city-form.component';
import { CitiesService } from './cities.service';

@Component({
    selector: 'px-cities',
    templateUrl: './cities.component.html',
    styleUrls: ['./cities.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CitiesComponent implements OnInit, OnDestroy {

    hasSelectedCities: boolean;
    searchInput: FormControl;
    dialogRef: any;
    stateProvinces: any;
    onSelectedCitiesChangedSubscription: Subscription;
    onStateProvincesChangedSubscription: Subscription;

    constructor(
        private citiesService: CitiesService,
        public dialog: MatDialog
    ) {
        this.searchInput = new FormControl('');

        this.onStateProvincesChangedSubscription =
            this.citiesService.onStateProvincesChanged.subscribe(stateProvinces => {
                console.log(stateProvinces)
                this.stateProvinces = stateProvinces;
            });
    }

    newCity() {
        this.dialogRef = this.dialog.open(CityFormComponent, {
            panelClass: 'city-form-dialog',
            data: {
                action: 'new',
                stateProvinces: this.stateProvinces
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this.citiesService.addCity(response.getRawValue());
            });
    }

    ngOnInit() {
        this.onSelectedCitiesChangedSubscription =
            this.citiesService.onSelectedCitiesChanged
                .subscribe(selectedCities => {
                    this.hasSelectedCities = selectedCities.length > 0;
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.citiesService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
        this.onSelectedCitiesChangedSubscription.unsubscribe();
        this.onStateProvincesChangedSubscription.unsubscribe();
    }

}
