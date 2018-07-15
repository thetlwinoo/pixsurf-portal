import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { StateProvincesService } from '../state-provinces.service';

@Component({
  selector: 'px-state-province-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class StateProvinceSelectedBarComponent {

  selectedStateProvinces: string[];
    hasSelectedStateProvinces: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private stateProvincesService: StateProvincesService,
        public dialog: MatDialog
    )
    {
        this.stateProvincesService.onSelectedStateProvincesChanged
            .subscribe(selectedStateProvinces => {
                this.selectedStateProvinces = selectedStateProvinces;
                setTimeout(() => {
                    this.hasSelectedStateProvinces = selectedStateProvinces.length > 0;
                    this.isIndeterminate = (selectedStateProvinces.length !== this.stateProvincesService.stateProvinces.length && selectedStateProvinces.length > 0);
                }, 0);
            });

    }

    selectAll()
    {
        this.stateProvincesService.selectStateProvinces();
    }

    deselectAll()
    {
        this.stateProvincesService.deselectStateProvinces();
    }

    deleteSelectedStateProvinces()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected state provinces?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.stateProvincesService.deleteSelectedStateProvinces();
            }
            this.confirmDialogRef = null;
        });
    }

}
