import { FuseUtils } from '@fuse/utils';

export class StateProvince
{
    id: string;
    stateProvinceCode: string;
    stateProvinceName: string;
    countryID: any;
    salesTerritory: string;
    border: string;
    latestRecordedPopulation: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(stateProvince)
    {
        {
            this.id = stateProvince._id || FuseUtils.generateGUID();
            this.stateProvinceCode = stateProvince.stateProvinceCode || '';
            this.stateProvinceName = stateProvince.stateProvinceName || '';
            this.countryID = stateProvince.countryID || '';
            this.salesTerritory = stateProvince.salesTerritory || '';
            this.border = stateProvince.border || '';
            this.latestRecordedPopulation = stateProvince.latestRecordedPopulation || '';
            this.lastEditedBy = stateProvince.lastEditedBy || {};
            this.validFrom = stateProvince.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = stateProvince.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
