import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { CustomerCategoryFormComponent } from '../customer-category-form/customer-category-form.component';
import { CustomerCategoriesService } from '../customer-categories.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'px-customer-category-list',
  templateUrl: './customer-category-list.component.html',
  styleUrls: ['./customer-category-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CustomerCategoryListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() countries;

  customerCategories: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'customerCategoryName', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedCustomerCategories: any[];
  checkboxes: {};

  onCustomerCategoriesChangedSubscription: Subscription;
  onSelectedCustomerCategoriesChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private customerCategoriesService: CustomerCategoriesService,
    public dialog: MatDialog
  ) {
    this.onCustomerCategoriesChangedSubscription =
      this.customerCategoriesService.onCustomerCategoriesChanged.subscribe(customerCategories => {
        this.customerCategories = customerCategories;

        this.checkboxes = {};
        customerCategories.map(customerCategory => {
          this.checkboxes[customerCategory.id] = false;
        });
      });

    this.onSelectedCustomerCategoriesChangedSubscription =
      this.customerCategoriesService.onSelectedCustomerCategoriesChanged.subscribe(selectedCustomerCategories => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedCustomerCategories.includes(id);
        }
        this.selectedCustomerCategories = selectedCustomerCategories;
      });

    this.onUserDataChangedSubscription =
      this.customerCategoriesService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.customerCategoriesService);
  }

  ngOnDestroy() {
    this.onCustomerCategoriesChangedSubscription.unsubscribe();
    this.onSelectedCustomerCategoriesChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editCustomerCategory(customerCategory) {
    this.dialogRef = this.dialog.open(CustomerCategoryFormComponent, {
      panelClass: 'customer-category-form-dialog',
      data: {
        customerCategory: customerCategory,
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

            this.customerCategoriesService.updateCustomerCategory(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteCustomerCategory(customerCategory);

            break;
        }
      });
  }

  /**
   * Delete CustomerCategories
   */
  deleteCustomerCategory(customerCategory) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerCategoriesService.deleteCustomerCategory(customerCategory);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(customerCategoryId) {
    this.customerCategoriesService.toggleSelectedCustomerCategory(customerCategoryId);
  }

  toggleStar(customerCategoryId) {
    if (this.user.starred.includes(customerCategoryId)) {
      this.user.starred.splice(this.user.starred.indexOf(customerCategoryId), 1);
    }
    else {
      this.user.starred.push(customerCategoryId);
    }

    // this.customerCategoriesService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private customerCategoriesService: CustomerCategoriesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.customerCategoriesService.onCustomerCategoriesChanged;
  }

  disconnect() {
  }
}

