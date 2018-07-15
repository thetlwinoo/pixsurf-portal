import { FuseUtils } from '@fuse/utils';

export class StockGroup
{
    id: string;
    stockGroupName: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(stockGroup)
    {
        {
            stockGroup = stockGroup || {};

            if (stockGroup.id) {
                this.id = stockGroup.id;
            } else {
                this.id = stockGroup._id || FuseUtils.generateGUID();
            }

            this.stockGroupName = stockGroup.stockGroupName || '';
            this.lastEditedBy = stockGroup.lastEditedBy || {};
            this.validFrom = stockGroup.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = stockGroup.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
