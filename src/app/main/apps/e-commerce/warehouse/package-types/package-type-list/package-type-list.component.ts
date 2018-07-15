import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { PackageTypeFormComponent } from '../package-type-form/package-type-form.component';
import { PackageTypesService } from '../package-types.service';

@Component({
  selector: 'px-package-type-list',
  templateUrl: './package-type-list.component.html',
  styleUrls: ['./package-type-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PackageTypeListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() stateProvinces;

  packageTypes: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'packageTypeName', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedPackageTypes: any[];
  checkboxes: {};

  onPackageTypesChangedSubscription: Subscription;
  onSelectedPackageTypesChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private packageTypesService: PackageTypesService,
    public dialog: MatDialog
  ) {
    this.onPackageTypesChangedSubscription =
      this.packageTypesService.onPackageTypesChanged.subscribe(packageTypes => {
        this.packageTypes = packageTypes;

        this.checkboxes = {};
        packageTypes.map(packageType => {
          this.checkboxes[packageType.id] = false;
        });
      });

    this.onSelectedPackageTypesChangedSubscription =
      this.packageTypesService.onSelectedPackageTypesChanged.subscribe(selectedPackageTypes => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedPackageTypes.includes(id);
        }
        this.selectedPackageTypes = selectedPackageTypes;
      });

    this.onUserDataChangedSubscription =
      this.packageTypesService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });

  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.packageTypesService);
  }

  ngOnDestroy() {
    this.onPackageTypesChangedSubscription.unsubscribe();
    this.onSelectedPackageTypesChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editPackageType(packageType) {
    this.dialogRef = this.dialog.open(PackageTypeFormComponent, {
      panelClass: 'package-type-form-dialog',
      data: {
        packageType: packageType,
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
            this.packageTypesService.updatePackageType(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deletePackageType(packageType);

            break;
        }
      });
  }

  /**
   * Delete PackageType
   */
  deletePackageType(packageType) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.packageTypesService.deletePackageType(packageType);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(packageTypeId) {
    this.packageTypesService.toggleSelectedPackageType(packageTypeId);
  }

  toggleStar(packageTypeId) {
    if (this.user.starred.includes(packageTypeId)) {
      this.user.starred.splice(this.user.starred.indexOf(packageTypeId), 1);
    }
    else {
      this.user.starred.push(packageTypeId);
    }

    // this.packageTypesService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private packageTypesService: PackageTypesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.packageTypesService.onPackageTypesChanged;
  }

  disconnect() {
  }
}

