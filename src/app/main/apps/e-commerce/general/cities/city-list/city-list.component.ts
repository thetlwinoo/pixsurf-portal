import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { CityFormComponent } from '../city-form/city-form.component';
import { CitiesService } from '../cities.service';

@Component({
  selector: 'px-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CityListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() stateProvinces;

  cities: any;  
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'cityName', 'stateProvinceID', 'location', 'latestRecordedPopulation', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedCities: any[];
  checkboxes: {};

  onCitiesChangedSubscription: Subscription;  
  onSelectedCitiesChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private citiesService: CitiesService,
    public dialog: MatDialog
  ) {
    this.onCitiesChangedSubscription =
      this.citiesService.onCitiesChanged.subscribe(cities => {
        this.cities = cities;

        this.checkboxes = {};
        cities.map(city => {
          this.checkboxes[city.id] = false;
        });
      });

    this.onSelectedCitiesChangedSubscription =
      this.citiesService.onSelectedCitiesChanged.subscribe(selectedCities => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedCities.includes(id);
        }
        this.selectedCities = selectedCities;
      });

    this.onUserDataChangedSubscription =
      this.citiesService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });    

  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.citiesService);
  }

  ngOnDestroy() {
    this.onCitiesChangedSubscription.unsubscribe();
    this.onSelectedCitiesChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editCity(city) {
    this.dialogRef = this.dialog.open(CityFormComponent, {
      panelClass: 'city-form-dialog',
      data: {
        city: city,        
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
            this.citiesService.updateCity(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteCity(city);

            break;
        }
      });
  }

  /**
   * Delete City
   */
  deleteCity(city) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.citiesService.deleteCity(city);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(cityId) {
    this.citiesService.toggleSelectedCity(cityId);
  }

  toggleStar(cityId) {
    if (this.user.starred.includes(cityId)) {
      this.user.starred.splice(this.user.starred.indexOf(cityId), 1);
    }
    else {
      this.user.starred.push(cityId);
    }

    // this.citiesService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private citiesService: CitiesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.citiesService.onCitiesChanged;
  }

  disconnect() {
  }
}

