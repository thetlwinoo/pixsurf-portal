import { FuseUtils } from '@fuse/utils';

export class Color
{
    id: string;
    colorCode: string;
    colorName: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(color)
    {
        {
            color = color || {};

            if (color.id) {
                this.id = color.id;
            } else {
                this.id = color._id || FuseUtils.generateGUID();
            }

            this.colorCode = color.colorCode || '';
            this.colorName = color.colorName || '';
            this.lastEditedBy = color.lastEditedBy || {};
            this.validFrom = color.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = color.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
