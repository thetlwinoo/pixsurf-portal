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

import { BuyingGroupsComponent } from './buying-groups/buying-groups.component';
import { BuyingGroupListComponent } from './buying-groups/buying-group-list/buying-group-list.component';
import { BuyingGroupFormComponent } from './buying-groups/buying-group-form/buying-group-form.component';
import { BuyingGroupSelectedBarComponent } from './buying-groups/selected-bar/selected-bar.component';

import { CustomerCategoriesComponent } from './customer-categories/customer-categories.component';
import { CustomerCategoryFormComponent } from './customer-categories/customer-category-form/customer-category-form.component';
import { CustomerCategoryListComponent } from './customer-categories/customer-category-list/customer-category-list.component';
import { CustomerCategorySelectedBarComponent } from './customer-categories/selected-bar/selected-bar.component';

import { EcommerceCustomersService } from './customers/customers.service';
import { EcommerceCustomerService } from './customer/customer.service';

import { BuyingGroupsService } from './buying-groups/buying-groups.service';
import { CustomerCategoriesService } from './customer-categories/customer-categories.service';
import { PxEcommerceCustomersComponent } from './customers/customers.component';
import { PxCustomerSelectedBarComponent } from './customers/selected-bar/selected-bar.component';
import { PxEcommerceCustomerComponent } from './customer/customer.component';
import { PxCustomerBasicComponent } from './customer/basic/basic.component';
import { ContactComponent } from './customer/contact/contact.component';
import { AccountComponent } from './customer/account/account.component';
import { DeliveryComponent } from './customer/delivery/delivery.component';

const routes: Routes = [
  {
    path: 'customers',
    component: PxEcommerceCustomersComponent,
    resolve: {
      data: EcommerceCustomersService
    }
  },
  {
    path: 'customers/:id',
    component: PxEcommerceCustomerComponent,
    resolve: {
      data: EcommerceCustomerService
    }
  },
  {
    path: 'buying-groups',
    component: BuyingGroupsComponent,
    resolve: {
      data: BuyingGroupsService
    }
  },
  {
    path: 'customer-categories',
    component: CustomerCategoriesComponent,
    resolve: {
      data: CustomerCategoriesService
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
    BuyingGroupsComponent,
    BuyingGroupListComponent,
    BuyingGroupFormComponent,
    BuyingGroupSelectedBarComponent,
    CustomerCategoriesComponent,
    CustomerCategoryFormComponent,
    CustomerCategoryListComponent,
    CustomerCategorySelectedBarComponent,
    PxEcommerceCustomersComponent,
    PxCustomerSelectedBarComponent,
    PxEcommerceCustomerComponent,
    PxCustomerBasicComponent,
    ContactComponent,
    AccountComponent,
    DeliveryComponent,
  ],
  providers: [
    BuyingGroupsService,
    CustomerCategoriesService,
    EcommerceCustomersService,
    EcommerceCustomerService,
    // {
    //   provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS,
    //   useValue: { float: 'auto' }
    // }
  ],
  entryComponents: [
    BuyingGroupFormComponent,
    CustomerCategoryFormComponent
  ]
})
export class PxEcommerceSalesModule { }
