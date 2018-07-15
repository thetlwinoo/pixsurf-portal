import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { StateProvinceFormComponent } from '../state-province-form/state-province-form.component';
import { StateProvincesService } from '../state-provinces.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'px-state-province-list',
  templateUrl: './state-province-list.component.html',
  styleUrls: ['./state-province-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class StateProvinceListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() countries;

  stateProvinces: any;
  user: any;
  dataSource: FilesDataSource | null;  
  displayedColumns = ['checkbox', 'stateProvinceCode', 'stateProvinceName', 'countryID', 'salesTerritory', 'border', 'latestRecordedPopulation', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedStateProvinces: any[];
  checkboxes: {};

  onStateProvincesChangedSubscription: Subscription;  
  onSelectedStateProvincesChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private stateProvincesService: StateProvincesService,
    public dialog: MatDialog
  ) {
    this.onStateProvincesChangedSubscription =
      this.stateProvincesService.onStateProvincesChanged.subscribe(stateProvinces => {
        this.stateProvinces = stateProvinces;

        this.checkboxes = {};
        stateProvinces.map(stateProvince => {
          this.checkboxes[stateProvince.id] = false;
        });
      });

    this.onSelectedStateProvincesChangedSubscription =
      this.stateProvincesService.onSelectedStateProvincesChanged.subscribe(selectedStateProvinces => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedStateProvinces.includes(id);
        }
        this.selectedStateProvinces = selectedStateProvinces;
      });

    this.onUserDataChangedSubscription =
      this.stateProvincesService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });      
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.stateProvincesService);
  }

  ngOnDestroy() {
    this.onStateProvincesChangedSubscription.unsubscribe();
    this.onSelectedStateProvincesChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editStateProvince(stateProvince) {
    this.dialogRef = this.dialog.open(StateProvinceFormComponent, {
      panelClass: 'state-province-form-dialog',
      data: {
        stateProvince: stateProvince,        
        countries: this.countries,
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

            this.stateProvincesService.updateStateProvince(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteStateProvince(stateProvince);

            break;
        }
      });
  }

  /**
   * Delete StateProvinces
   */
  deleteStateProvince(stateProvince) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stateProvincesService.deleteStateProvince(stateProvince);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(stateProvinceId) {
    this.stateProvincesService.toggleSelectedStateProvince(stateProvinceId);
  }

  toggleStar(stateProvinceId) {
    if (this.user.starred.includes(stateProvinceId)) {
      this.user.starred.splice(this.user.starred.indexOf(stateProvinceId), 1);
    }
    else {
      this.user.starred.push(stateProvinceId);
    }

    // this.stateProvincesService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private stateProvincesService: StateProvincesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.stateProvincesService.onStateProvincesChanged;
  }

  disconnect() {
  }
}

