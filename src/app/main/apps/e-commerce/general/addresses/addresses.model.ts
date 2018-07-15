import { FuseUtils } from '@fuse/utils';

export class Address {
    id: string;
    addressType: any;
    addressLine1: string;
    addressLine2: string;
    city: any;
    stateProvince: any;
    country: any;
    geoLocation: string;
    postalCode: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(address) {
        {
            this.id = address._id || FuseUtils.generateGUID();
            this.addressType = address.addressType || {};
            this.addressLine1 = address.addressLine1 || '';
            this.addressLine2 = address.addressLine2 || '';
            this.city = address.city || {};
            this.stateProvince = address.stateProvince || {};
            this.country = address.country || {};
            this.geoLocation = address.geoLocation || '';
            this.postalCode = address.postalCode || '';
            this.lastEditedBy = address.lastEditedBy || {};
            this.validFrom = address.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = address.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
