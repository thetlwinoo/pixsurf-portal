import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatCardModule, MatListModule, MatGridListModule, MatTableModule, MatProgressBarModule, MatCheckboxModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { CloudinaryComponent } from './cloudinary.component';
import { CloudinaryService } from './cloudinary.service';
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import { CloudinaryConfiguration, CloudinaryModule } from '@cloudinary/angular-5.x';
import { Cloudinary } from '@cloudinary/angular-5.x/src/cloudinary.service';
import { FileUploadModule } from 'ng2-file-upload';
import { environment } from 'environments/environment';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

export const cloudinary = { Cloudinary: CloudinaryCore };
export const config: CloudinaryConfiguration = environment.cloudinary;

@NgModule({
    declarations: [
        CloudinaryComponent
    ],
    imports: [
        CommonModule,
        NgxDatatableModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatListModule,
        MatGridListModule,
        MatProgressBarModule,
        MatTableModule,
        MatCheckboxModule,
        // Cloudinary
        CloudinaryModule.forRoot(cloudinary, config),
        FileUploadModule
    ],
    exports: [
        CloudinaryComponent
    ],
    entryComponents: [],
    providers: [
        CloudinaryService
    ]
})
export class PxCloudinaryModule {
}
