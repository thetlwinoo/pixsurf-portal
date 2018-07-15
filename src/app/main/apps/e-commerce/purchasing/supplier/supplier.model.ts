import { MatChipInputEvent } from '@angular/material';

import { FuseUtils } from '@fuse/utils';

export class Supplier {
    id: string;
    supplierName: string;
    supplierCategoryID: any;
    primaryContactPersonID: any;
    alternateContactPersonID: any;
    deliveryMethodID: any;
    deliveryCityID: any;
    postalCityID: any;
    supplierReference: string;
    bankAccountName: string;
    bankAccountBranch: string;
    bankAccountCode: string;
    bankAccountNumber: string;
    bankInternationalCode: string;
    paymentDays: number;
    internalComments: string;
    phoneNumber: string;
    faxNumber: string;
    websiteURL: string;
    deliveryAddressLine1: string;
    deliveryAddressLine2: string;
    deliveryPostalCode: string;
    deliveryLocation: string;
    postalAddressLine1: string;
    postalAddressLine2: string;
    postalPostalCode: string;
    lastEditedBy: string;
    validFrom: string;
    validTo: string;

    constructor(supplier?) {

        supplier = supplier || {};

        if (supplier.id) {
            this.id = supplier.id;
        } else {
            this.id = supplier._id || FuseUtils.generateGUID();
        }

        this.supplierName = supplier.supplierName || '';
        this.supplierCategoryID = supplier.supplierCategoryID || {};
        this.primaryContactPersonID = supplier.primaryContactPersonID || {};
        this.alternateContactPersonID = supplier.alternateContactPersonID || {};
        this.deliveryMethodID = supplier.deliveryMethodID || {};
        this.deliveryCityID = supplier.deliveryCityID || {};
        this.postalCityID = supplier.postalCityID || {};
        this.supplierReference = supplier.supplierReference || '';
        this.bankAccountName = supplier.bankAccountName || '';
        this.bankAccountBranch = supplier.bankAccountBranch || '';
        this.bankAccountCode = supplier.bankAccountCode || '';
        this.bankAccountNumber = supplier.bankAccountNumber || '';
        this.bankInternationalCode = supplier.bankInternationalCode || '';
        this.paymentDays = supplier.paymentDays || 0;
        this.internalComments = supplier.internalComments || '';
        this.phoneNumber = supplier.phoneNumber || '';
        this.faxNumber = supplier.faxNumber || '';
        this.websiteURL = supplier.websiteURL || '';
        this.deliveryAddressLine1 = supplier.deliveryAddressLine1 || '';
        this.deliveryAddressLine2 = supplier.deliveryAddressLine2 || '';
        this.deliveryPostalCode = supplier.deliveryPostalCode || '';
        this.deliveryLocation = supplier.deliveryLocation || '';
        this.postalAddressLine1 = supplier.postalAddressLine1 || '';
        this.postalAddressLine2 = supplier.postalAddressLine2 || '';
        this.postalPostalCode = supplier.postalPostalCode || '';
        this.lastEditedBy = supplier.lastEditedBy || '';
        this.validFrom = supplier.validFrom || new Date('2018-01-01 00:00:00.0000000');
        this.validTo = supplier.validTo || new Date('9999-12-31 23:59:59.9999999');
    }
}
