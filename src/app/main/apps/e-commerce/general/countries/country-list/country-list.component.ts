import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { CountryFormComponent } from '../country-form/country-form.component';
import { CountriesService } from '../countries.service';

@Component({
  selector: 'px-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CountryListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  countries: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'countryName', 'isoAlpha3Code', 'isoNumericCode', 'latestRecordedPopulation', 'continent', 'region', 'subregion', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedCountries: any[];
  checkboxes: {};

  onCountriesChangedSubscription: Subscription;
  onSelectedCountriesChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private countriesService: CountriesService,
    public dialog: MatDialog
  ) {
    this.onCountriesChangedSubscription =
      this.countriesService.onCountriesChanged.subscribe(countries => {
        this.countries = countries;

        this.checkboxes = {};
        countries.map(country => {
          this.checkboxes[country.id] = false;
        });
      });

    this.onSelectedCountriesChangedSubscription =
      this.countriesService.onSelectedCountriesChanged.subscribe(selectedCountries => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedCountries.includes(id);
        }
        this.selectedCountries = selectedCountries;
      });

    this.onUserDataChangedSubscription =
      this.countriesService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });

  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.countriesService);
  }

  ngOnDestroy() {
    this.onCountriesChangedSubscription.unsubscribe();
    this.onSelectedCountriesChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editCountry(country) {
    this.dialogRef = this.dialog.open(CountryFormComponent, {
      panelClass: 'country-form-dialog',
      data: {
        country: country,
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

            this.countriesService.updateCountry(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteCountry(country);

            break;
        }
      });
  }

  /**
   * Delete Country
   */
  deleteCountry(country) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.countriesService.deleteCountry(country);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(countryId) {
    this.countriesService.toggleSelectedCountry(countryId);
  }

  toggleStar(countryId) {
    if (this.user.starred.includes(countryId)) {
      this.user.starred.splice(this.user.starred.indexOf(countryId), 1);
    }
    else {
      this.user.starred.push(countryId);
    }

    // this.countriesService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private countriesService: CountriesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.countriesService.onCountriesChanged;
  }

  disconnect() {
  }
}

