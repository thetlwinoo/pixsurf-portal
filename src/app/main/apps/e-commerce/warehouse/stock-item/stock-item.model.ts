import { MatChipInputEvent } from '@angular/material';

import { FuseUtils } from '@fuse/utils';

export class StockItem {
    id: string;
    stockItemName: string;
    supplierID: string;
    colorID: string;
    unitPackageID: string;
    outerPackageID: string;
    quantityOnHand: number;
    binLocation: string;
    lastStocktakeQuantity: number;
    lastCostPrice: number;
    reorderLevel: number;
    targetStockLevel: number;
    stockGroups: [string];
    brand: string;
    size: string;
    leadTimeDays: number;
    quantityPerOuter: number;
    isChillerStock: boolean;
    barcode: string;
    taxRate: number;
    unitPrice: number;
    recommendedRetailPrice: number;
    typicalWeightPerUnit: number;
    marketingComments: string;
    internalComments: string;
    photo: string;
    customFields: string;
    tags: string[];
    images: any[];
    searchDetails: string;
    lastEditedBy: string;
    validFrom: string;
    validTo: string;

    constructor(stockItem?) {
        stockItem = stockItem || {};
        this.id = stockItem._id || FuseUtils.generateGUID();
        this.stockItemName = stockItem.stockItemName || '';
        this.supplierID = stockItem.supplierID || '';
        this.colorID = stockItem.colorID || '';
        this.unitPackageID = stockItem.unitPackageID || '';
        this.outerPackageID = stockItem.outerPackageID || '';
        this.quantityOnHand = stockItem.quantityOnHand || 0;
        this.binLocation = stockItem.binLocation || '';
        this.lastStocktakeQuantity = stockItem.lastStocktakeQuantity || 0;
        this.lastCostPrice = stockItem.lastCostPrice || 0;
        this.reorderLevel = stockItem.reorderLevel || 0;
        this.targetStockLevel = stockItem.targetStockLevel || 0;
        this.stockGroups = stockItem.stockGroups || [];
        this.brand = stockItem.brand || '';
        this.size = stockItem.size || '';
        this.leadTimeDays = stockItem.leadTimeDays || 0;
        this.quantityPerOuter = stockItem.quantityPerOuter || 0;
        this.isChillerStock = stockItem.isChillerStock || false;
        this.barcode = stockItem.barcode || '';
        this.taxRate = stockItem.taxRate || 0;
        this.unitPrice = stockItem.unitPrice || 0;
        this.recommendedRetailPrice = stockItem.recommendedRetailPrice || 0;
        this.typicalWeightPerUnit = stockItem.typicalWeightPerUnit || 0;
        this.marketingComments = stockItem.marketingComments || '';
        this.internalComments = stockItem.internalComments || '';
        this.photo = stockItem.photo || '';
        this.customFields = stockItem.customFields || '';
        this.tags = stockItem.tags || [];
        this.images = stockItem.images || [];
        this.searchDetails = stockItem.searchDetails || '';
        this.lastEditedBy = stockItem.lastEditedBy || '';
        this.validFrom = stockItem.validFrom || new Date('2018-01-01 00:00:00.0000000');
        this.validTo = stockItem.validTo || new Date('9999-12-31 23:59:59.9999999');
    }

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add tag
        if (value) {
            this.tags.push(value);
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeTag(tag) {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }
}
