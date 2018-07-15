import { FuseUtils } from '@fuse/utils';

export class PackageType
{
    id: string;
    packageTypeName: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(packageType)
    {
        {
            packageType = packageType || {};

            if (packageType.id) {
                this.id = packageType.id;
            } else {
                this.id = packageType._id || FuseUtils.generateGUID();
            }

            this.packageTypeName = packageType.packageTypeName || '';
            this.lastEditedBy = packageType.lastEditedBy || {};
            this.validFrom = packageType.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = packageType.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
