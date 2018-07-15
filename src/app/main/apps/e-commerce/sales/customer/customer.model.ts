import { MatChipInputEvent } from '@angular/material';

import { FuseUtils } from '@fuse/utils';

export class Customer {
    id: string;
    person: any;
    billToCustomer: any;
    customerCategory: any;
    buyingGroup: any;
    primaryContactPerson: any;
    alternateContactPerson: any;
    deliveryMethod: any;
    deliveryAddress: any;
    creditLimit: number;
    accountOpenedDate: Date;
    standardDiscountPercentage: number;
    isStatementSent: Boolean;
    isOnCreditHold: Boolean;
    paymentDays: number;
    deliveryRun: string;
    runPosition: string;
    accountNumber: string;
    lastEditedBy: string;
    validFrom: string;
    validTo: string;

    constructor(customer?) {

        customer = customer || {};

        if (customer.id) {
            this.id = customer.id;
        } else {
            this.id = customer._id || FuseUtils.generateGUID();
        }

        this.person = customer.person || '';
        this.billToCustomer = customer.billToCustomer || {};
        this.customerCategory = customer.customerCategory || {};
        this.buyingGroup = customer.buyingGroup || {};
        this.primaryContactPerson = customer.primaryContactPerson || {};
        this.alternateContactPerson = customer.alternateContactPerson || {};
        this.deliveryMethod = customer.deliveryMethod || {};
        this.deliveryAddress = customer.deliveryAddress || {};
        this.creditLimit = customer.creditLimit || 0;
        this.accountOpenedDate = customer.accountOpenedDate || Date.now();
        this.standardDiscountPercentage = customer.standardDiscountPercentage || 0;
        this.isStatementSent = customer.isStatementSent || false;
        this.isOnCreditHold = customer.isOnCreditHold || false;
        this.paymentDays = customer.paymentDays || 0;
        this.deliveryRun = customer.deliveryRun || '';
        this.runPosition = customer.runPosition || '';
        this.accountNumber = customer.accountNumber || '';
        this.lastEditedBy = customer.lastEditedBy || '';
        this.validFrom = customer.validFrom || new Date('2018-01-01 00:00:00.0000000');
        this.validTo = customer.validTo || new Date('9999-12-31 23:59:59.9999999');
    }
}
