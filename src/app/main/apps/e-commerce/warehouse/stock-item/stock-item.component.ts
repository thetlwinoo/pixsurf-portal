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

import { StockItem } from './stock-item.model';
import { EcommerceStockItemService } from './stock-item.service';
import { Location } from '@angular/common';

@Component({
  selector: 'px-e-commerce-stockItem',
  templateUrl: './stock-item.component.html',
  styleUrls: ['./stock-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PxEcommerceStockItemComponent implements OnInit, OnDestroy {
  stockItem = new StockItem();
  pageType: string;
  stockItemForm: FormGroup;
  suppliers: any;
  colors: any;
  packageTypes: any;
  stockGroups: any;

  onStockItemChanged: Subscription;
  onSupplierChanged: Subscription;
  onColorChanged: Subscription;
  onPackageTypeChanged: Subscription;
  onStockGroupsChanged: Subscription;

  constructor(
    private stockItemService: EcommerceStockItemService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location
  ) {
    this.onSupplierChanged =
      this.stockItemService.onSupplierChanged.subscribe(suppliers => {
        this.suppliers = suppliers;
      });

    this.onPackageTypeChanged =
      this.stockItemService.onPackageTypeChanged.subscribe(packateTypes => {
        this.packageTypes = packateTypes;
      });

    this.onColorChanged =
      this.stockItemService.onColorChanged.subscribe(colors => {
        this.colors = colors;
      });

    this.onStockGroupsChanged =
      this.stockItemService.onStockGroupsChanged.subscribe(stockGroups => {
        this.stockGroups = stockGroups;
      });
  }

  ngOnInit() {
    // Subscribe to update stockItem on changes
    this.onStockItemChanged =
      this.stockItemService.onStockItemChanged
        .subscribe(stockItem => {

          if (stockItem) {
            this.stockItem = new StockItem(stockItem);
            this.pageType = 'edit';
          }
          else {
            this.pageType = 'new';
            this.stockItem = new StockItem({
              validFrom: new Date('2018-01-01 00:00:00.0000000'),
              validTo: new Date('9999-12-31 23:59:59.9999999')
            });

          }

          this.stockItemForm = this.createStockItemForm();
        });
  }

  ngOnDestroy() {
    this.onStockItemChanged.unsubscribe();
  }

  createStockItemForm() {
    return this.formBuilder.group({
      id: [this.stockItem.id],
      stockItemName: [this.stockItem.stockItemName],
      supplierID: [this.stockItem.supplierID],
      colorID: [this.stockItem.colorID],
      stockGroups: [this.stockItem.stockGroups],
      unitPackageID: [this.stockItem.unitPackageID],
      outerPackageID: [this.stockItem.outerPackageID],
      quantityOnHand: [this.stockItem.quantityOnHand],
      binLocation: [this.stockItem.binLocation],
      lastStocktakeQuantity: [this.stockItem.lastStocktakeQuantity],
      lastCostPrice: [this.stockItem.lastCostPrice],
      reorderLevel: [this.stockItem.reorderLevel],
      targetStockLevel: [this.stockItem.targetStockLevel],
      brand: [this.stockItem.brand],
      size: [this.stockItem.size],
      leadTimeDays: [this.stockItem.leadTimeDays],
      quantityPerOuter: [this.stockItem.quantityPerOuter],
      isChillerStock: [this.stockItem.isChillerStock],
      barcode: [this.stockItem.barcode],
      taxRate: [this.stockItem.taxRate],
      unitPrice: [this.stockItem.unitPrice],
      recommendedRetailPrice: [this.stockItem.recommendedRetailPrice],
      typicalWeightPerUnit: [this.stockItem.typicalWeightPerUnit],
      marketingComments: [this.stockItem.marketingComments],
      internalComments: [this.stockItem.internalComments],
      photo: [this.stockItem.photo],
      customFields: [this.stockItem.customFields],
      tags: [this.stockItem.tags],
      searchDetails: [this.stockItem.searchDetails],
      lastEditedBy: [this.stockItem.lastEditedBy],
      validFrom: [this.stockItem.validFrom],
      validTo: [this.stockItem.validTo]
    });
  }

  saveStockItem() {
    const data = this.stockItemForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);
    this.stockItemService.saveStockItem(data)
      .then(() => {
        // Trigger the subscription with new data
        this.stockItemService.onStockItemChanged.next(data);

        // Show the success message
        this.snackBar.open('StockItem saved', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }

  addStockItem() {
    const data = this.stockItemForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);
    data.lastEditedBy = data.colorID;
    data.validFrom = Date.now();
    data.validTo = Date.now();
    this.stockItemService.addStockItem(data)
      .then((res) => {
        // Trigger the subscription with new data
        this.stockItemService.onStockItemChanged.next(res);

        // Show the success message
        this.snackBar.open('StockItem added', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });

        // Change the location with new one
        this.location.go('apps/e-commerce/stockItems/' + this.stockItem.id);
      });
  }
  
}
