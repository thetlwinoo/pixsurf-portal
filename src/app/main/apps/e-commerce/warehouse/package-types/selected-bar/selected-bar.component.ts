import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { PackageTypesService } from '../package-types.service';

@Component({
  selector: 'px-package-type-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class PackageTypeSelectedBarComponent {

  selectedPackageTypes: string[];
    hasSelectedPackageTypes: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private packageTypesService: PackageTypesService,
        public dialog: MatDialog
    )
    {
        this.packageTypesService.onSelectedPackageTypesChanged
            .subscribe(selectedPackageTypes => {
                this.selectedPackageTypes = selectedPackageTypes;
                setTimeout(() => {
                    this.hasSelectedPackageTypes = selectedPackageTypes.length > 0;
                    this.isIndeterminate = (selectedPackageTypes.length !== this.packageTypesService.packageTypes.length && selectedPackageTypes.length > 0);
                }, 0);
            });

    }

    selectAll()
    {
        this.packageTypesService.selectPackageTypes();
    }

    deselectAll()
    {
        this.packageTypesService.deselectPackageTypes();
    }

    deleteSelectedPackageTypes()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected package types?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.packageTypesService.deleteSelectedPackageTypes();
            }
            this.confirmDialogRef = null;
        });
    }

}
