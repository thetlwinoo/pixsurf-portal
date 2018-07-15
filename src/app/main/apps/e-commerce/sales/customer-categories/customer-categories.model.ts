import { FuseUtils } from '@fuse/utils';

export class CustomerCategory
{
    id: string;
    customerCategoryName: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(customerCategory)
    {
        {
            this.id = customerCategory._id || FuseUtils.generateGUID();
            this.customerCategoryName = customerCategory.customerCategoryName || '';
            this.lastEditedBy = customerCategory.lastEditedBy || {};
            this.validFrom = customerCategory.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = customerCategory.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
