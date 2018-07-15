import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { PackageTypeFormComponent } from './package-type-form/package-type-form.component';
import { PackageTypesService } from './package-types.service';

@Component({
    selector: 'px-package-types',
    templateUrl: './package-types.component.html',
    styleUrls: ['./package-types.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PackageTypesComponent implements OnInit, OnDestroy {

    hasSelectedPackageTypes: boolean;
    searchInput: FormControl;
    dialogRef: any;
    onSelectedPackageTypesChangedSubscription: Subscription;

    constructor(
        private packageTypesService: PackageTypesService,
        public dialog: MatDialog
    ) {
        this.searchInput = new FormControl('');
    }

    newPackageType() {
        this.dialogRef = this.dialog.open(PackageTypeFormComponent, {
            panelClass: 'package-type-form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this.packageTypesService.addPackageType(response.getRawValue());
            });
    }

    ngOnInit() {
        this.onSelectedPackageTypesChangedSubscription =
            this.packageTypesService.onSelectedPackageTypesChanged
                .subscribe(selectedPackageTypes => {
                    this.hasSelectedPackageTypes = selectedPackageTypes.length > 0;
                });

        this.searchInput.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(searchText => {
                this.packageTypesService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
        this.onSelectedPackageTypesChangedSubscription.unsubscribe();
    }

}
