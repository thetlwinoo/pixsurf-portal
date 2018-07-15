import { FuseUtils } from '@fuse/utils';

export class People {
    id: string;
    fullName: string;
    preferredName: string;
    searchName: string;
    isPermittedToLogon: boolean;
    logonName: string;
    isExternalLogonProvider: boolean;
    isSystemUser: boolean;
    isEmployee: boolean;
    isSalesperson: boolean;
    userPreferences: object;
    phoneNumber: string;
    faxNumber: string;
    emailAddress: string;
    photo: string;
    customFields: string;
    otherLanguages: [string];
    lastEditedBy: any;
    validFrom: Date;
    validTo: Date;

    constructor(people?) {
        {
            people = people || {};
            this.id = people._id || FuseUtils.generateGUID();
            this.fullName = people.fullName || '';
            this.preferredName = people.preferredName || '';
            this.searchName = people.searchName || '';
            this.isPermittedToLogon = people.isPermittedToLogon || false;
            this.logonName = people.logonName || '';
            this.isExternalLogonProvider = people.isExternalLogonProvider || false;
            this.isSystemUser = people.isSystemUser || false;
            this.isEmployee = people.isEmployee || false;
            this.isSalesperson = people.isSalesperson || false;
            this.userPreferences = people.userPreferences || {};
            this.phoneNumber = people.phoneNumber || '';
            this.faxNumber = people.faxNumber || '';
            this.emailAddress = people.emailAddress || '';
            this.photo = people.photo || '';
            this.customFields = people.customFields || '';
            this.otherLanguages = people.otherLanguages || [];
            this.lastEditedBy = people.lastEditedBy || {};
            this.validFrom = people.validFrom || new Date('2018-01-01 00:00:00.0000000');
            this.validTo = people.validTo || new Date('9999-12-31 23:59:59.9999999');
        }
    }
}
