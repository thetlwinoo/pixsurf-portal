import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { SupplierCategoryFormComponent } from './supplier-category-form/supplier-category-form.component';
import { SupplierCategoriesService } from './supplier-categories.service';

@Component({
  selector: 'px-supplier-categories',
  templateUrl: './supplier-categories.component.html',
  styleUrls: ['./supplier-categories.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SupplierCategoriesComponent implements OnInit, OnDestroy {

  hasSelectedSupplierCategories: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedSupplierCategoriesChangedSubscription: Subscription;

  constructor(
    private supplierCategoriesService: SupplierCategoriesService,
    public dialog: MatDialog
  ) {
    this.searchInput = new FormControl('');
  }

  newSupplierCategory() {
    this.dialogRef = this.dialog.open(SupplierCategoryFormComponent, {
      panelClass: 'supplier-category-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }

        this.supplierCategoriesService.addSupplierCategory(response.getRawValue());
      });
  }

  ngOnInit() {
    this.onSelectedSupplierCategoriesChangedSubscription =
      this.supplierCategoriesService.onSelectedSupplierCategoriesChanged
        .subscribe(selectedSupplierCategories => {
          this.hasSelectedSupplierCategories = selectedSupplierCategories.length > 0;
        });

    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.supplierCategoriesService.onSearchTextChanged.next(searchText);
      });
  }

  ngOnDestroy() {
    this.onSelectedSupplierCategoriesChangedSubscription.unsubscribe();
  }

}
