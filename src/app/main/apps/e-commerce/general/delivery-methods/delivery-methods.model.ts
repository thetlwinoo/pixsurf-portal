import { FuseUtils } from '@fuse/utils';

export class DeliveryMethod
{
    id: string;
    deliveryMethodName: string;
    latestRecordedPopulation: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(deliveryMethod)
    {
        {
            this.id = deliveryMethod._id || FuseUtils.generateGUID();
            this.deliveryMethodName = deliveryMethod.deliveryMethodName || '';
            this.latestRecordedPopulation = deliveryMethod.latestRecordedPopulation || '';
            this.lastEditedBy = deliveryMethod.lastEditedBy || {};
            this.validFrom = deliveryMethod.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = deliveryMethod.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
