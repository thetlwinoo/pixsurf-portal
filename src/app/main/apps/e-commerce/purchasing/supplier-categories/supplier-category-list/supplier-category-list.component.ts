import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { SupplierCategoryFormComponent } from '../supplier-category-form/supplier-category-form.component';
import { SupplierCategoriesService } from '../supplier-categories.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'px-supplier-category-list',
  templateUrl: './supplier-category-list.component.html',
  styleUrls: ['./supplier-category-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SupplierCategoryListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  supplierCategories: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'supplierCategoryName', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedSupplierCategories: any[];
  checkboxes: {};

  onSupplierCategoriesChangedSubscription: Subscription;
  onSelectedSupplierCategoriesChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private supplierCategoriesService: SupplierCategoriesService,
    public dialog: MatDialog
  ) {
    this.onSupplierCategoriesChangedSubscription =
      this.supplierCategoriesService.onSupplierCategoriesChanged.subscribe(supplierCategories => {
        this.supplierCategories = supplierCategories;

        this.checkboxes = {};
        supplierCategories.map(supplierCategory => {
          this.checkboxes[supplierCategory.id] = false;
        });
      });

    this.onSelectedSupplierCategoriesChangedSubscription =
      this.supplierCategoriesService.onSelectedSupplierCategoriesChanged.subscribe(selectedSupplierCategories => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedSupplierCategories.includes(id);
        }
        this.selectedSupplierCategories = selectedSupplierCategories;
      });

    this.onUserDataChangedSubscription =
      this.supplierCategoriesService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.supplierCategoriesService);
  }

  ngOnDestroy() {
    this.onSupplierCategoriesChangedSubscription.unsubscribe();
    this.onSelectedSupplierCategoriesChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editSupplierCategory(supplierCategory) {
    this.dialogRef = this.dialog.open(SupplierCategoryFormComponent, {
      panelClass: 'supplier-category-form-dialog',
      data: {
        supplierCategory: supplierCategory,
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

            this.supplierCategoriesService.updateSupplierCategory(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteSupplierCategory(supplierCategory);

            break;
        }
      });
  }

  /**
   * Delete SupplierCategories
   */
  deleteSupplierCategory(supplierCategory) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supplierCategoriesService.deleteSupplierCategory(supplierCategory);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(supplierCategoryId) {
    this.supplierCategoriesService.toggleSelectedSupplierCategory(supplierCategoryId);
  }

  toggleStar(supplierCategoryId) {
    if (this.user.starred.includes(supplierCategoryId)) {
      this.user.starred.splice(this.user.starred.indexOf(supplierCategoryId), 1);
    }
    else {
      this.user.starred.push(supplierCategoryId);
    }

    // this.supplierCategoriesService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private supplierCategoriesService: SupplierCategoriesService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.supplierCategoriesService.onSupplierCategoriesChanged;
  }

  disconnect() {
  }
}

