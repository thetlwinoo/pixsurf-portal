import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { StateProvinceFormComponent } from './state-province-form/state-province-form.component';
import { StateProvincesService } from './state-provinces.service';

@Component({
  selector: 'px-state-provinces',
  templateUrl: './state-provinces.component.html',
  styleUrls: ['./state-provinces.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class StateProvincesComponent implements OnInit, OnDestroy {

  hasSelectedStateProvinces: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedStateProvincesChangedSubscription: Subscription;
  onCountriesChangedSubscription: Subscription;
  countries: any;

  constructor(
    private stateProvincesService: StateProvincesService,
    public dialog: MatDialog
  ) {
    this.searchInput = new FormControl('');

    this.onCountriesChangedSubscription =
      this.stateProvincesService.onCountriesChanged.subscribe(countries => {
        this.countries = countries;
      });
  }

  newStateProvince() {
    this.dialogRef = this.dialog.open(StateProvinceFormComponent, {
      panelClass: 'state-province-form-dialog',
      data: {
        action: 'new',
        countries: this.countries,
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }

        this.stateProvincesService.addStateProvince(response.getRawValue());
      });
  }

  ngOnInit() {
    this.onSelectedStateProvincesChangedSubscription =
      this.stateProvincesService.onSelectedStateProvincesChanged
        .subscribe(selectedStateProvinces => {
          this.hasSelectedStateProvinces = selectedStateProvinces.length > 0;
        });

    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.stateProvincesService.onSearchTextChanged.next(searchText);
      });
  }

  ngOnDestroy() {
    this.onSelectedStateProvincesChangedSubscription.unsubscribe();
    this.onCountriesChangedSubscription.unsubscribe();
  }

}
