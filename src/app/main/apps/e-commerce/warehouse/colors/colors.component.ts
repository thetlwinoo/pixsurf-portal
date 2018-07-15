import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { ColorFormComponent } from './color-form/color-form.component';
import { ColorsService } from './colors.service';

@Component({
    selector: 'px-colors',
    templateUrl: './colors.component.html',
    styleUrls: ['./colors.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ColorsComponent implements OnInit, OnDestroy {

    hasSelectedColors: boolean;
    searchInput: FormControl;
    dialogRef: any;
    onSelectedColorsChangedSubscription: Subscription;

    constructor(
        private colorsService: ColorsService,
        public dialog: MatDialog
    ) {
        this.searchInput = new FormControl('');
    }

    newColor() {
        this.dialogRef = this.dialog.open(ColorFormComponent, {
            panelClass: 'color-form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this.colorsService.addColor(response.getRawValue());
            });
    }

    ngOnInit() {
        this.onSelectedColorsChangedSubscription =
            this.colorsService.onSelectedColorsChanged
                .subscribe(selectedColors => {
                    this.hasSelectedColors = selectedColors.length > 0;
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.colorsService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
        this.onSelectedColorsChangedSubscription.unsubscribe();
    }

}
