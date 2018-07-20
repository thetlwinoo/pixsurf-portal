import { Component, OnInit, Input, NgZone, ViewEncapsulation, OnDestroy, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgStyle } from '@angular/common';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CloudinaryService } from './cloudinary.service';
import { Subscription } from 'rxjs/Subscription';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'cloudinary',
    templateUrl: './cloudinary.component.html',
    styleUrls: ['./cloudinary.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class CloudinaryComponent implements OnInit, OnDestroy {
    @Input() responses: Array<any>;
    @Input() stockItem: any;
    @Output() onSave: EventEmitter<any> = new EventEmitter();

    dataSource: FilesDataSource | null;
    columnsToDisplay = ['select', 'name', 'size', 'type', 'status', 'progress'];
    expandedElement: any;
    selection = new SelectionModel<any>(true, []);

    onResponseChangedSubscription: Subscription;
    private hasBaseDropZoneOver: boolean = false;
    private uploader: FileUploader;
    rows = new Array<any>();

    constructor(
        private cloudinary: Cloudinary,
        private cloudinaryService: CloudinaryService,
        private zone: NgZone,
        private http: HttpClient
    ) {
        this.responses = [];

        this.cloudinaryService.onResponseChanged.next(this.responses);
    }

    ngOnInit(): void {
        this.dataSource = new FilesDataSource(this.cloudinaryService);

        const uploaderOptions: FileUploaderOptions = {
            url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
            autoUpload: true,
            isHTML5: true,
            removeAfterUpload: true,
            headers: [
                {
                    name: 'X-Requested-With',
                    value: 'XMLHttpRequest'
                }
            ]
        };
        this.uploader = new FileUploader(uploaderOptions);

        this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
            form.append('upload_preset', this.cloudinary.config().upload_preset);
            let tags = this.stockItem.id;
            if (this.stockItem.stockItemName) {
                form.append('context', `photo=${this.stockItem.id}:${this.stockItem.stockItemName}`);
                tags = `${this.stockItem.id},${this.stockItem.stockItemName}`;
            }
            form.append('folder', 'pixsurf_media');
            form.append('tags', tags);
            form.append('file', fileItem);
            fileItem.withCredentials = false;
            return { fileItem, form };
        };

        const upsertResponse = fileItem => {
            this.zone.run(() => {
                const existingId = this.responses.reduce((prev, current, index) => {
                    if (current.file.name === fileItem.file.name && !current.status) {
                        return index;
                    }
                    return prev;
                }, -1);
                if (existingId > -1) {
                    this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
                } else {
                    this.responses.push(fileItem);
                }
            });
        };

        this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
            upsertResponse(
                {
                    file: item.file,
                    status,
                    data: JSON.parse(response)
                }
            );
            console.log(this.responses)
            this.cloudinaryService.onResponseChanged.next(this.responses);
        }


        this.uploader.onProgressItem = (fileItem: any, progress: any) =>
            upsertResponse(
                {
                    file: fileItem.file,
                    progress,
                    data: {}
                }
            );
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.responses.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.responses.forEach(row => this.selection.select(row));
    }

    deleteImage = function (data: any, index: number) {
        const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
        const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
        const options = { headers: headers };
        const body = {
            token: data.delete_token
        };
        this.http.post(url, body, options).subscribe(response => {
            console.log(`Deleted image - ${data.public_id} ${response.result}`);
            this.responses.splice(index, 1);
            this.cloudinaryService.onResponseChanged.next(this.responses);
        });
    };

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    getFileProperties(fileProperties: any) {
        if (!fileProperties) {
            return null;
        }
        return Object.keys(fileProperties)
            .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
    }

    onSaveSelected(event) {
        this.onSave.emit(event);
        this.selection.clear();
    }

    onDeleteSelected(event) {

    }

    removeResponse(index) {
        this.responses.splice(index, 1);
        this.cloudinaryService.onResponseChanged.next(this.responses);
    }

    clearResponses() {
        this.cloudinaryService.onResponseChanged.next(false);
    }

    ngOnDestroy() {
        if (this.onResponseChangedSubscription) this.onResponseChangedSubscription.unsubscribe();
    }
}

export class FilesDataSource extends DataSource<any>
{
    constructor(private cloudinaryService: CloudinaryService) {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
        return this.cloudinaryService.onResponseChanged;
    }

    disconnect() {
    }
}