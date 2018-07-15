import { FuseUtils } from '@fuse/utils';

export class SupplierCategory
{
    id: string;
    supplierCategoryName: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(supplierCategory)
    {
        {
            this.id = supplierCategory._id || FuseUtils.generateGUID();
            this.supplierCategoryName = supplierCategory.supplierCategoryName || '';
            this.lastEditedBy = supplierCategory.lastEditedBy || {};
            this.validFrom = supplierCategory.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = supplierCategory.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
