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
  MatCardModule,
  MatDatepickerModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatRadioModule,
  MatTooltipModule,
  MatSnackBarModule
} from '@angular/material';

import { PxEcommerceStockItemsComponent } from './stock-items/stock-items.component';
import { EcommerceStockItemsService } from './stock-items/stock-items.service';
import { PxEcommerceStockItemComponent } from './stock-item/stock-item.component';
import { EcommerceStockItemService } from './stock-item/stock-item.service';
import { PxStockItemBasicComponent } from './stock-item/basic/basic.component';
import { PxStockItemPricingComponent } from './stock-item/pricing/pricing.component';
import { PxStockItemShipingComponent } from './stock-item/shiping/shiping.component';
import { PxStockItemSelectedBarComponent } from './stock-items/selected-bar/selected-bar.component';
import { ColorsComponent } from './colors/colors.component';
import { ColorFormComponent } from './colors/color-form/color-form.component';
import { ColorListComponent } from './colors/color-list/color-list.component';
import { ColorSelectedBarComponent } from './colors/selected-bar/selected-bar.component';
import { ColorsService } from './colors/colors.service';
import { PackageTypesComponent } from './package-types/package-types.component';
import { PackageTypeFormComponent } from './package-types/package-type-form/package-type-form.component';
import { PackageTypeListComponent } from './package-types/package-type-list/package-type-list.component';
import { PackageTypeSelectedBarComponent } from './package-types/selected-bar/selected-bar.component';
import { PackageTypesService } from './package-types/package-types.service';
import { StockGroupsComponent } from './stock-groups/stock-groups.component';
import { StockGroupFormComponent } from './stock-groups/stock-group-form/stock-group-form.component';
import { StockGroupListComponent } from './stock-groups/stock-group-list/stock-group-list.component';
import { StockGroupSelectedBarComponent } from './stock-groups/selected-bar/selected-bar.component';
import { StockGroupsService } from './stock-groups/stock-groups.service';
import { StockHoldingComponent } from './stock-item/stock-holding/stock-holding.component';
import { PackagingComponent } from './stock-item/packaging/packaging.component';
import { StockImageComponent } from './stock-item/stock-image/stock-image.component';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
​
const routes: Routes = [
  {
    path: 'stock-items',
    component: PxEcommerceStockItemsComponent,
    resolve: {
      data: EcommerceStockItemsService
    }
  },
  {
    path: 'stock-items/:id',
    component: PxEcommerceStockItemComponent,
    resolve: {
      data: EcommerceStockItemService
    }
  },
  {
    path: 'colors',
    component: ColorsComponent,
    resolve: {
      data: ColorsService
    }
  },
  {
    path: 'package-types',
    component: PackageTypesComponent,
    resolve: {
      data: PackageTypesService
    }
  },
  {
    path: 'stock-groups',
    component: StockGroupsComponent,
    resolve: {
      data: StockGroupsService
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
    MatCardModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatRadioModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSnackBarModule,

    NgxDatatableModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
  ],
  declarations: [
    PxEcommerceStockItemsComponent,
    PxEcommerceStockItemComponent,
    PxStockItemBasicComponent,
    PxStockItemPricingComponent,
    PxStockItemShipingComponent,
    PxStockItemSelectedBarComponent,
    ColorsComponent,
    ColorFormComponent,
    ColorListComponent,
    ColorSelectedBarComponent,
    PackageTypesComponent,
    PackageTypeFormComponent,
    PackageTypeListComponent,
    PackageTypeSelectedBarComponent,
    StockGroupsComponent,
    StockGroupFormComponent,
    StockGroupListComponent,
    StockGroupSelectedBarComponent,
    StockHoldingComponent,
    PackagingComponent,
    StockImageComponent,
    FileSelectDirective
  ],
  providers: [
    EcommerceStockItemsService,
    EcommerceStockItemService,
    ColorsService,
    PackageTypesService,
    StockGroupsService,
    // {
    //   provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS,
    //   useValue: { float: 'auto' }
    // }
  ],
  entryComponents: [
    ColorFormComponent,
    PackageTypeFormComponent,
    StockGroupFormComponent
  ]
})
export class PxEcommerceWarehouseModule { }
