import { MatChipInputEvent } from '@angular/material';

import { FuseUtils } from '@fuse/utils';

export class Image {
    id: string;
    name: string;
    sortOrder: number;
    stockItemId: string;
    type: string;
    fileId: string; 
    size: number;
    webkitRelativePath: string;
    uri: string;
    lastModified: Date;
    isBaseImage: boolean;
    isSmallImage: boolean;
    isThumbnail: boolean;
    exclude: boolean;    

    constructor(image?) {
        image = image || {};
        this.id = image._id || FuseUtils.generateGUID();
        this.name = image.name || '';
        this.sortOrder = image.sortOrder || 0;
        this.stockItemId = image.stockItemId || '';
        this.type = image.type || '';
        this.fileId = image.fileId || '';
        this.size = image.size || 0;
        this.webkitRelativePath = image.webkitRelativePath || '';
        this.lastModified = image.lastModified || Date.now();
        this.isBaseImage = image.isBaseImage || false;
        this.isSmallImage = image.isSmallImage || false;
        this.isThumbnail = image.isThumbnail || false;
        this.exclude = image.exclude || false;    
        this.uri = image.uri || '';    
    }    
}
