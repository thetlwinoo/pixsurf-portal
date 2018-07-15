import { FuseUtils } from '@fuse/utils';

export class Country {
    id: string;
    countryName: string;
    formalName: string;
    isoAlpha3Code: string;
    isoNumericCode: string;
    countryType: string;
    latestRecordedPopulation: number;
    continent: string;
    region: string;
    subregion: string;
    border: string;
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(country) {
        {
            country = country || {};
            this.id = country._id || FuseUtils.generateGUID();
            this.countryName = country.countryName || '';
            this.formalName = country.formalName || '';
            this.isoAlpha3Code = country.isoAlpha3Code || '';
            this.isoNumericCode = country.isoNumericCode || '';
            this.countryType = country.countryType || '';
            this.latestRecordedPopulation = country.latestRecordedPopulation || 0;
            this.continent = country.continent || '';
            this.region = country.region || '';
            this.subregion = country.subregion || '';
            this.border = country.border || '';
            this.lastEditedBy = country.lastEditedBy || {};
            this.validFrom = country.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = country.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
