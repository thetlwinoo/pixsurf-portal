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
  MatSnackBarModule
} from '@angular/material';
import { CitiesComponent } from './cities/cities.component';
import { CountriesComponent } from './countries/countries.component';
import { DeliveryMethodsComponent } from './delivery-methods/delivery-methods.component';
import { PxEcommercePeopleComponent } from './people/people.component';
import { StateProvincesComponent } from './state-provinces/state-provinces.component';
import { CityFormComponent } from './cities/city-form/city-form.component';
import { CityListComponent } from './cities/city-list/city-list.component';
import { CitySelectedBarComponent } from './cities/selected-bar/selected-bar.component';
import { EcommercePeopleDetailsService } from './people-details/people-details.service';
import { StateProvinceFormComponent } from './state-provinces/state-province-form/state-province-form.component';
import { StateProvinceListComponent } from './state-provinces/state-province-list/state-province-list.component';
import { StateProvinceSelectedBarComponent } from './state-provinces/selected-bar/selected-bar.component';
import { CountryFormComponent } from './countries/country-form/country-form.component';
import { CountryListComponent } from './countries/country-list/country-list.component';
import { CountrySelectedBarComponent } from './countries/selected-bar/selected-bar.component';
import { DeliveryMethodSelectedBarComponent } from './delivery-methods/selected-bar/selected-bar.component';
import { DeliveryMethodFormComponent } from './delivery-methods/delivery-method-form/delivery-method-form.component';
import { DeliveryMethodListComponent } from './delivery-methods/delivery-method-list/delivery-method-list.component';
import { PxPeopleSelectedBarComponent } from './people/selected-bar/selected-bar.component';
import { PxEcommercePeopleDetailsComponent } from './people-details/people-details.component';
import { PxPeopleBasicComponent } from './people-details/basic/basic.component';
import { LanguagesComponent } from './languages/languages.component';
import { LanguageFormComponent } from './languages/language-form/language-form.component';
import { LanguageListComponent } from './languages/language-list/language-list.component';
import { LanguageSelectedBarComponent } from './languages/selected-bar/selected-bar.component';
import { ConfigurationComponent } from './people-details/configuration/configuration.component';
import { AddressTypesComponent } from './address-types/address-types.component';
import { AddressTypeFormComponent } from './address-types/address-type-form/address-type-form.component';
import { AddressTypeListComponent } from './address-types/address-type-list/address-type-list.component';
import { AddressTypeSelectedBarComponent } from './address-types/selected-bar/selected-bar.component';
import { AddressesComponent } from './addresses/addresses.component';
import { AddressFormComponent } from './addresses/address-form/address-form.component';
import { AddressListComponent } from './addresses/address-list/address-list.component';
import { AddressSelectedBarComponent } from './addresses/selected-bar/selected-bar.component';

import { CitiesService } from './cities/cities.service';
import { CountriesService } from './countries/countries.service';
import { DeliveryMethodsService } from './delivery-methods/delivery-methods.service';
import { EcommercePeopleService } from './people/people.service';
import { LanguagesService } from './languages/languages.service';
import { AddressesService } from './addresses/addresses.service';
import { AddressTypesService } from './address-types/address-types.service';
import { StateProvincesService } from './state-provinces/state-provinces.service';

const routes: Routes = [
  {
    path: 'cities',
    component: CitiesComponent,
    resolve: {
      data: CitiesService
    }
  },
  {
    path: 'countries',
    component: CountriesComponent,
    resolve: {
      data: CountriesService
    }
  },
  {
    path: 'delivery-methods',
    component: DeliveryMethodsComponent,
    resolve: {
      data: DeliveryMethodsService
    }
  },
  {
    path: 'people',
    component: PxEcommercePeopleComponent,
    resolve: {
      data: EcommercePeopleService
    }
  },
  {
    path: 'people/:id',
    component: PxEcommercePeopleDetailsComponent,
    resolve: {
      data: EcommercePeopleDetailsService
    }
  },
  {
    path: 'state-provinces',
    component: StateProvincesComponent,
    resolve: {
      data: StateProvincesService
    }
  },
  {
    path: 'languages',
    component: LanguagesComponent,
    resolve: {
      data: LanguagesService
    }
  },
  {
    path: 'addresses',
    component: AddressesComponent,
    resolve: {
      data: AddressesService
    }
  },
  {
    path: 'address-types',
    component: AddressTypesComponent,
    resolve: {
      data: AddressTypesService
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
    MatDatepickerModule,
    MatSnackBarModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
  ],
  declarations: [
    CitiesComponent,
    CountriesComponent,
    DeliveryMethodsComponent,
    PxEcommercePeopleComponent,
    StateProvincesComponent,
    CityFormComponent,
    CityListComponent,
    CitySelectedBarComponent,
    StateProvinceFormComponent,
    StateProvinceListComponent,
    StateProvinceSelectedBarComponent,
    CountryFormComponent,
    CountryListComponent,
    CountrySelectedBarComponent,
    DeliveryMethodSelectedBarComponent,
    DeliveryMethodFormComponent,
    DeliveryMethodListComponent,
    PxPeopleSelectedBarComponent,
    PxEcommercePeopleDetailsComponent,
    PxPeopleBasicComponent,
    LanguagesComponent,
    LanguageFormComponent,
    LanguageListComponent,
    LanguageSelectedBarComponent,
    ConfigurationComponent,
    AddressTypesComponent,
    AddressTypeFormComponent,
    AddressTypeListComponent,
    AddressTypeSelectedBarComponent,
    AddressesComponent,
    AddressFormComponent,
    AddressListComponent,
    AddressSelectedBarComponent
  ],
  providers: [
    CitiesService,
    CountriesService,
    DeliveryMethodsService,
    EcommercePeopleService,
    EcommercePeopleDetailsService,
    StateProvincesService,
    LanguagesService,
    AddressesService,
    AddressTypesService
  ],
  entryComponents: [
    CityFormComponent,
    StateProvinceFormComponent,
    CountryFormComponent,
    DeliveryMethodFormComponent,
    LanguageFormComponent,
    AddressFormComponent,
    AddressTypeFormComponent
  ]
})
export class PxEcommerceGeneralModule { }
