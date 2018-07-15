import { FuseUtils } from '@fuse/utils';

export class BuyingGroup
{
    id: string;
    buyingGroupName: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(buyingGroup)
    {
        {
            this.id = buyingGroup._id || FuseUtils.generateGUID();
            this.buyingGroupName = buyingGroup.buyingGroupName || '';
            this.lastEditedBy = buyingGroup.lastEditedBy || {};
            this.validFrom = buyingGroup.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = buyingGroup.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
