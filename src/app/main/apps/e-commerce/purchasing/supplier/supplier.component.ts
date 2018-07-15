import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { Supplier } from './supplier.model';
import { EcommerceSupplierService } from './supplier.service';
import { Location } from '@angular/common';

@Component({
  selector: 'px-e-commerce-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PxEcommerceSupplierComponent implements OnInit, OnDestroy {
  supplier = new Supplier();
  onSupplierChanged: Subscription;
  pageType: string;
  supplierForm: FormGroup;

  supplierCategories: any;
  persons: any;
  cities: any;
  deliveryMethods: any;
  currentPrimaryContact: any;
  currentAlternateContact: any;

  onSupplierCategoriesChanged: Subscription;
  onPersonChanged: Subscription;
  onCitiesChanged: Subscription;
  onDeliveryMethodsChanged: Subscription;

  constructor(
    private supplierService: EcommerceSupplierService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location
  ) {
    this.onSupplierCategoriesChanged =
      this.supplierService.onSupplierCategoriesChanged.subscribe(supplierCategories => {
        this.supplierCategories = supplierCategories;
      });

    this.onPersonChanged =
      this.supplierService.onPersonChanged.subscribe(persons => {
        this.persons = persons;
      });

    this.onCitiesChanged =
      this.supplierService.onCitiesChanged.subscribe(cities => {
        this.cities = cities;
      });

    this.onDeliveryMethodsChanged =
      this.supplierService.onDeliveryMethodsChanged.subscribe(deliveryMethods => {
        this.deliveryMethods = deliveryMethods;
      });
  }

  ngOnInit() {
    // Subscribe to update supplier on changes
    this.onSupplierChanged =
      this.supplierService.onSupplierChanged
        .subscribe(supplier => {

          if (supplier) {
            this.supplier = new Supplier(supplier);
            this.pageType = 'edit';
          }
          else {
            this.pageType = 'new';
            this.supplier = new Supplier({
              deliveryCityID: this.cities[0],
              postalCityID: this.cities[0],
              supplierCategoryID: this.supplierCategories[0],
              validFrom: new Date('2018-01-01 00:00:00.0000000'),
              validTo: new Date('9999-12-31 23:59:59.9999999')
            });
          }
          this.supplierForm = this.createSupplierForm();
        });
  }

  ngOnDestroy() {
    this.onSupplierChanged.unsubscribe();
    this.onSupplierCategoriesChanged.unsubscribe();
    this.onPersonChanged.unsubscribe();
    this.onCitiesChanged.unsubscribe();
    this.onDeliveryMethodsChanged.unsubscribe();
  }

  createSupplierForm() {
    return this.formBuilder.group({
      id: [this.supplier.id],
      supplierName: [this.supplier.supplierName],
      supplierCategoryID: [this.supplier.supplierCategoryID],
      primaryContactPersonID: [this.supplier.primaryContactPersonID],
      alternateContactPersonID: [this.supplier.alternateContactPersonID],
      deliveryMethodID: [this.supplier.deliveryMethodID],
      deliveryCityID: [this.supplier.deliveryCityID],
      postalCityID: [this.supplier.postalCityID],
      supplierReference: [this.supplier.supplierReference],
      bankAccountName: [this.supplier.bankAccountName],
      bankAccountBranch: [this.supplier.bankAccountBranch],
      bankAccountCode: [this.supplier.bankAccountCode],
      bankAccountNumber: [this.supplier.bankAccountNumber],
      bankInternationalCode: [this.supplier.bankInternationalCode],
      paymentDays: [this.supplier.paymentDays],
      internalComments: [this.supplier.internalComments],
      phoneNumber: [this.supplier.phoneNumber],
      faxNumber: [this.supplier.faxNumber],
      websiteURL: [this.supplier.websiteURL],
      deliveryAddressLine1: [this.supplier.deliveryAddressLine1],
      deliveryAddressLine2: [this.supplier.deliveryAddressLine2],
      deliveryPostalCode: [this.supplier.deliveryPostalCode],
      deliveryLocation: [this.supplier.deliveryLocation],
      postalAddressLine1: [this.supplier.postalAddressLine1],
      postalAddressLine2: [this.supplier.postalAddressLine2],
      postalPostalCode: [this.supplier.postalPostalCode],
      lastEditedBy: [this.supplier.lastEditedBy],
      validFrom: [this.supplier.validFrom],
      validTo: [this.supplier.validTo]
    });
  }

  saveSupplier() {
    const data = this.supplierForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);
console.log(data)
    if (this.currentPrimaryContact) {
      data.primaryContactPersonID = this.currentPrimaryContact._id;
    }

    if (this.currentAlternateContact) {
      data.alternateContactPersonID = this.currentAlternateContact._id;
    }

    this.supplierService.saveSupplier(data)
      .then(() => {
        // Trigger the subscription with new data
        this.supplierService.onSupplierChanged.next(data);

        // Show the success message
        this.snackBar.open('Supplier saved', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }

  addSupplier() {
    const data = this.supplierForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);
    if (this.currentPrimaryContact) {
      data.primaryContactPersonID = this.currentPrimaryContact._id;
    }

    if (this.currentAlternateContact) {
      data.alternateContactPersonID = this.currentAlternateContact._id;
    }
    this.supplierService.addSupplier(data)
      .then((res) => {
        // Trigger the subscription with new data
        this.supplierService.onSupplierChanged.next(res);

        // Show the success message
        this.snackBar.open('Supplier added', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });

        // Change the location with new one
        this.location.go('apps/e-commerce/suppliers/' + this.supplier.id);
      });
  }

  setPrimaryContact(event) {
    this.currentPrimaryContact = event;
    this.supplierForm.markAsDirty();
  }

  setAlternateContact(event) {
    this.currentAlternateContact = event;
    this.supplierForm.markAsDirty();
  }
}
