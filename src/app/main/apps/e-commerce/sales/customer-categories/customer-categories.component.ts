import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { CustomerCategoryFormComponent } from './customer-category-form/customer-category-form.component';
import { CustomerCategoriesService } from './customer-categories.service';

@Component({
  selector: 'px-customer-categories',
  templateUrl: './customer-categories.component.html',
  styleUrls: ['./customer-categories.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CustomerCategoriesComponent implements OnInit, OnDestroy {

  hasSelectedCustomerCategories: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedCustomerCategoriesChangedSubscription: Subscription;

  constructor(
    private customerCategoriesService: CustomerCategoriesService,
    public dialog: MatDialog
  ) {
    this.searchInput = new FormControl('');
  }

  newCustomerCategory() {
    this.dialogRef = this.dialog.open(CustomerCategoryFormComponent, {
      panelClass: 'customer-category-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }

        this.customerCategoriesService.addCustomerCategory(response.getRawValue());
      });
  }

  ngOnInit() {
    this.onSelectedCustomerCategoriesChangedSubscription =
      this.customerCategoriesService.onSelectedCustomerCategoriesChanged
        .subscribe(selectedCustomerCategories => {
          this.hasSelectedCustomerCategories = selectedCustomerCategories.length > 0;
        });

    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.customerCategoriesService.onSearchTextChanged.next(searchText);
      });
  }

  ngOnDestroy() {
    this.onSelectedCustomerCategoriesChangedSubscription.unsubscribe();
  }

}
