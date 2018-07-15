import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { CitiesService } from '../cities.service';

@Component({
  selector: 'px-city-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class CitySelectedBarComponent {

  selectedCities: string[];
    hasSelectedCities: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private citiesService: CitiesService,
        public dialog: MatDialog
    )
    {
        this.citiesService.onSelectedCitiesChanged
            .subscribe(selectedCities => {
                this.selectedCities = selectedCities;
                setTimeout(() => {
                    this.hasSelectedCities = selectedCities.length > 0;
                    this.isIndeterminate = (selectedCities.length !== this.citiesService.cities.length && selectedCities.length > 0);
                }, 0);
            });

    }

    selectAll()
    {
        this.citiesService.selectCities();
    }

    deselectAll()
    {
        this.citiesService.deselectCities();
    }

    deleteSelectedCities()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected cities?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.citiesService.deleteSelectedCities();
            }
            this.confirmDialogRef = null;
        });
    }

}
