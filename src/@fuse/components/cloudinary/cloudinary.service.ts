import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CloudinaryService {

    onResponseChanged: BehaviorSubject<any> = new BehaviorSubject({});
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) { }
}
