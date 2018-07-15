import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { 
    MatButtonModule, 
    MatChipsModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatInputModule, 
    MatPaginatorModule, 
    MatRippleModule, 
    MatSelectModule, 
    MatSnackBarModule, 
    MatSortModule, 
    MatTableModule, 
    MatTabsModule,
    MatMenuModule,
    MatCheckboxModule
} from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { EcommerceDashboardComponent } from 'app/main/apps/e-commerce/dashboard/dashboard.component';
import { EcommerceDashboardService } from 'app/main/apps/e-commerce/dashboard/dashboard.service';

import { PxEcommerceWarehouseModule } from './warehouse/warehouse.module';
import { PxEcommerceGeneralModule } from './general/general.module';
import { PxEcommercePurchasingModule } from './purchasing/purchasing.module';
import { PxEcommerceSalesModule } from './sales/sales.module';

const routes: Routes = [
    {
        path     : 'dashboard',
        component: EcommerceDashboardComponent,
        resolve  : {
            data: EcommerceDashboardService
        }
    },
    {
        path: 'general',
        loadChildren: './general/general.module#PxEcommerceGeneralModule'
      },
      {
        path: 'purchasing',
        loadChildren: './purchasing/purchasing.module#PxEcommercePurchasingModule'
      },
      {
        path: 'warehouse',
        loadChildren: './warehouse/warehouse.module#PxEcommerceWarehouseModule'
      },
      {
        path: 'sales',
        loadChildren: './sales/sales.module#PxEcommerceSalesModule'
      },
];

@NgModule({
    declarations: [
        EcommerceDashboardComponent,
    ],
    imports     : [
        RouterModule.forChild(routes),

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

        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule,
    ],
    providers   : [
        EcommerceDashboardService
    ]
})
export class EcommerceModule
{
}
