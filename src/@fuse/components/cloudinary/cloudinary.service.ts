import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CloudinaryService {

    responses: Array<any>;
    onResponseChanged: BehaviorSubject<any> = new BehaviorSubject({});
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        this.onResponseChanged.subscribe(responses => {
            this.responses = responses;
        });
    }

    removeResponse(publicId) {
        var index = this.responses.findIndex(file => file.data.public_id == publicId);
        this.responses.splice(index, 1);
        this.onResponseChanged.next(this.responses);
    }

    clearResponses() {
        this.onResponseChanged.next(false);
    }
}
