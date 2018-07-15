import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { CdkTableModule } from '@angular/cdk/table';
import { FuseConfirmDialogModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import {
  MatCheckboxModule,
  MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatMenuModule,
  MatRippleModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatSnackBarModule
  // MAT_PLACEHOLDER_GLOBAL_OPTIONS
} from '@angular/material';

import { PxEcommerceSuppliersComponent } from './suppliers/suppliers.component';
import { PxSupplierSelectedBarComponent } from './suppliers/selected-bar/selected-bar.component';
import { PxEcommerceSupplierComponent } from './supplier/supplier.component';
import { PxSupplierBasicComponent } from './supplier/basic/basic.component';

import { EcommerceSuppliersService } from './suppliers/suppliers.service';
import { EcommerceSupplierService } from './supplier/supplier.service';
import { SupplierCategoriesService } from './supplier-categories/supplier-categories.service';
import { SupplierCategoriesComponent } from './supplier-categories/supplier-categories.component';
import { SupplierCategorySelectedBarComponent } from './supplier-categories/selected-bar/selected-bar.component';
import { SupplierCategoryListComponent } from './supplier-categories/supplier-category-list/supplier-category-list.component';
import { SupplierCategoryFormComponent } from './supplier-categories/supplier-category-form/supplier-category-form.component';
import { BankInfoComponent } from './supplier/bank-info/bank-info.component';
import { DeliveryComponent } from './supplier/delivery/delivery.component';
import { ContactComponent } from './supplier/contact/contact.component';
const routes: Routes = [
  {
    path: 'suppliers',
    component: PxEcommerceSuppliersComponent,
    resolve: {
      data: EcommerceSuppliersService
    }
  },
  {
    path: 'suppliers/:id',
    component: PxEcommerceSupplierComponent,
    resolve: {
      data: EcommerceSupplierService
    }
  },
  {
    path: 'supplier-categories',
    component: SupplierCategoriesComponent,
    resolve: {
      data: SupplierCategoriesService
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    CdkTableModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatSnackBarModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
  ],
  declarations: [
    PxEcommerceSuppliersComponent,
    PxSupplierSelectedBarComponent,
    PxEcommerceSupplierComponent,
    PxSupplierBasicComponent,
    SupplierCategoriesComponent,
    SupplierCategorySelectedBarComponent,
    SupplierCategoryListComponent,
    SupplierCategoryFormComponent,
    BankInfoComponent,
    DeliveryComponent,
    ContactComponent
  ],
  providers: [
    EcommerceSuppliersService,
    EcommerceSupplierService,
    SupplierCategoriesService,
    // {
    //   provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS,
    //   useValue: { float: 'auto' }
    // }
  ],
  entryComponents: [
    SupplierCategoryFormComponent
  ]
})
export class PxEcommercePurchasingModule { }
