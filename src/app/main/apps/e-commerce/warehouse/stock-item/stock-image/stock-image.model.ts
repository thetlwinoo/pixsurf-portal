import { MatChipInputEvent } from '@angular/material';

import { FuseUtils } from '@fuse/utils';

export class Photo {
    id: string;
    sortOrder: number;
    stockItemId: string;
    data: Object;
    file: Object;
    lastModified: Date;
    isBaseImage: boolean;
    isSmallImage: boolean;
    isThumbnail: boolean;
    exclude: boolean;    
    url: string;

    constructor(photo?) {
        photo = photo || {};
        this.id = photo._id || FuseUtils.generateGUID();
        this.data = photo.data || {};
        this.sortOrder = photo.sortOrder || 0;
        this.stockItemId = photo.stockItemId || '';
        this.file = photo.file || {};
        this.lastModified = photo.lastModified || Date.now();
        this.isBaseImage = photo.isBaseImage || false;
        this.isSmallImage = photo.isSmallImage || false;
        this.isThumbnail = photo.isThumbnail || false;
        this.exclude = photo.exclude || false;  
        this.url = photo.url || '';        
    }    
}
