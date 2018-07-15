import { FuseUtils } from '@fuse/utils';

export class AddressType
{
    id: string;
    addressTypeName: string;
    lastEditedBy: any;

    constructor(addressType)
    {
        {
            this.id = addressType._id || FuseUtils.generateGUID();
            this.addressTypeName = addressType.addressTypeName || '';
            this.lastEditedBy = addressType.lastEditedBy || {};
        }
    }
}
