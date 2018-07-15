import { FuseUtils } from '@fuse/utils';

export class Language
{
    id: string;
    languageCode: string;
    languageName: string;
    lastEditedBy: any;

    constructor(language)
    {
        {
            language = language || {};
            this.id = language._id || FuseUtils.generateGUID();
            this.languageCode = language.languageCode || '';
            this.languageName = language.languageName || '';
            this.lastEditedBy = language.lastEditedBy || {};
        }
    }
}
