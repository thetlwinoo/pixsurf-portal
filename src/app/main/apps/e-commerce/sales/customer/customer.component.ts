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

import { Customer } from './customer.model';
import { EcommerceCustomerService } from './customer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'px-e-commerce-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PxEcommerceCustomerComponent implements OnInit, OnDestroy {
  customer = new Customer();
  onCustomerChanged: Subscription;
  pageType: string;
  customerForm: FormGroup;

  customerCategories: any;
  persons: any;
  buyingGroups: any;
  deliveryMethods: any;
  currentPrimaryContact: any;
  currentAlternateContact: any;

  onCustomerCategoriesChanged: Subscription;
  onPersonChanged: Subscription;
  onBuyingGroupsChanged: Subscription;
  onDeliveryMethodsChanged: Subscription;

  constructor(
    private customerService: EcommerceCustomerService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location
  ) {
    this.onCustomerCategoriesChanged =
      this.customerService.onCustomerCategoriesChanged.subscribe(customerCategories => {
        this.customerCategories = customerCategories;
      });

    this.onPersonChanged =
      this.customerService.onPersonChanged.subscribe(persons => {
        this.persons = persons;
      });

    this.onBuyingGroupsChanged =
      this.customerService.onBuyingGroupChanged.subscribe(buyingGroups => {
        this.buyingGroups = buyingGroups;
      });

    this.onDeliveryMethodsChanged =
      this.customerService.onDeliveryMethodsChanged.subscribe(deliveryMethods => {
        this.deliveryMethods = deliveryMethods;
      });
  }

  ngOnInit() {
    // Subscribe to update customer on changes
    this.onCustomerChanged =
      this.customerService.onCustomerChanged
        .subscribe(customer => {

          if (customer) {
            this.customer = new Customer(customer);
            this.pageType = 'edit';
          }
          else {
            this.pageType = 'new';
            this.customer = new Customer({
              deliveryCityID: this.buyingGroups[0],
              postalCityID: this.buyingGroups[0],
              customerCategoryID: this.customerCategories[0],
              validFrom: new Date('2018-01-01 00:00:00.0000000'),
              validTo: new Date('9999-12-31 23:59:59.9999999')
            });
          }
          this.customerForm = this.createCustomerForm();
        });
  }

  ngOnDestroy() {
    this.onCustomerChanged.unsubscribe();
    this.onCustomerCategoriesChanged.unsubscribe();
    this.onPersonChanged.unsubscribe();
    this.onBuyingGroupsChanged.unsubscribe();
    this.onDeliveryMethodsChanged.unsubscribe();
  }

  createCustomerForm() {
    return this.formBuilder.group({
      id: [this.customer.id],
      person: [this.customer.person],
      billToCustomer: [this.customer.billToCustomer],
      customerCategory: [this.customer.customerCategory],
      buyingGroup: [this.customer.buyingGroup],
      primaryContactPerson: [this.customer.primaryContactPerson],
      alternateContactPerson: [this.customer.alternateContactPerson],
      deliveryMethod: [this.customer.deliveryMethod],
      deliveryAddress: [this.customer.deliveryAddress],
      creditLimit: [this.customer.creditLimit],
      accountOpenedDate: [this.customer.accountOpenedDate],
      standardDiscountPercentage: [this.customer.standardDiscountPercentage],
      isStatementSent: [this.customer.isStatementSent],
      isOnCreditHold: [this.customer.isOnCreditHold],
      paymentDays: [this.customer.paymentDays],
      deliveryRun: [this.customer.deliveryRun],
      runPosition: [this.customer.runPosition],
      accountNumber: [this.customer.accountNumber],
      lastEditedBy: [this.customer.lastEditedBy],
      validFrom: [this.customer.validFrom],
      validTo: [this.customer.validTo]
    });
  }

  saveCustomer() {
    const data = this.customerForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);
    console.log(data)
    if (this.currentPrimaryContact) {
      data.primaryContactPerson = this.currentPrimaryContact._id;
    }

    if (this.currentAlternateContact) {
      data.alternateContactPerson = this.currentAlternateContact._id;
    }

    this.customerService.saveCustomer(data)
      .then(() => {
        // Trigger the subscription with new data
        this.customerService.onCustomerChanged.next(data);

        // Show the success message
        this.snackBar.open('Customer saved', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }

  addCustomer() {
    const data = this.customerForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);
    if (this.currentPrimaryContact) {
      data.primaryContactPerson = this.currentPrimaryContact._id;
    }

    if (this.currentAlternateContact) {
      data.alternateContactPerson = this.currentAlternateContact._id;
    }
    this.customerService.addCustomer(data)
      .then((res) => {
        // Trigger the subscription with new data
        this.customerService.onCustomerChanged.next(res);

        // Show the success message
        this.snackBar.open('Customer added', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });

        // Change the location with new one
        this.location.go('apps/e-commerce/customers/' + this.customer.id);
      });
  }

  setPrimaryContact(event) {
    this.currentPrimaryContact = event;
    this.customerForm.markAsDirty();
  }

  setAlternateContact(event) {
    this.currentAlternateContact = event;
    this.customerForm.markAsDirty();
  }
}
