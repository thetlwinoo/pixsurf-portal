import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ColorsService } from '../colors.service';

@Component({
  selector: 'px-color-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class ColorSelectedBarComponent {

  selectedColors: string[];
    hasSelectedColors: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private colorsService: ColorsService,
        public dialog: MatDialog
    )
    {
        this.colorsService.onSelectedColorsChanged
            .subscribe(selectedColors => {
                this.selectedColors = selectedColors;
                setTimeout(() => {
                    this.hasSelectedColors = selectedColors.length > 0;
                    this.isIndeterminate = (selectedColors.length !== this.colorsService.colors.length && selectedColors.length > 0);
                }, 0);
            });

    }

    selectAll()
    {
        this.colorsService.selectColors();
    }

    deselectAll()
    {
        this.colorsService.deselectColors();
    }

    deleteSelectedColors()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected colors?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.colorsService.deleteSelectedColors();
            }
            this.confirmDialogRef = null;
        });
    }

}
