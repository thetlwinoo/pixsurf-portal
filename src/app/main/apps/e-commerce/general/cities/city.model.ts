import { FuseUtils } from '@fuse/utils';

export class City
{
    id: string;
    cityName: string;
    stateProvinceID: any;
    location: string;
    latestRecordedPopulation: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(city)
    {
        {
            this.id = city._id || FuseUtils.generateGUID();
            this.cityName = city.cityName || '';
            this.stateProvinceID = city.stateProvinceID || '';
            this.location = city.location || '';
            this.latestRecordedPopulation = city.latestRecordedPopulation || '';
            this.lastEditedBy = city.lastEditedBy || {};
            this.validFrom = city.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = city.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
