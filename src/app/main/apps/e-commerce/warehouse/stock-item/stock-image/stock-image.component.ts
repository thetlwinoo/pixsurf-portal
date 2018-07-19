import { Component, OnInit, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { EcommerceStockItemService } from '../stock-item.service';
import { DataSource } from '@angular/cdk/collections';
// import { FileUploader } from 'ng2-file-upload';
import { fuseAnimations } from '@fuse/animations';
// const URL = 'https://pixsurf-api.herokuapp.com/uploads/';
import { Subscription } from 'rxjs/Subscription';
import { Image } from './stock-image.model';
import { HttpClient } from '@angular/common/http';
import { FileUploader } from 'ng2-file-upload';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'px-stock-item-image',
  templateUrl: './stock-image.component.html',
  styleUrls: ['./stock-image.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class StockImageComponent implements OnInit {
  @ViewChild('filePreview') filePreview: ElementRef;
  @Input() pageType;
  @Input() stockItem;
  @Input('group')  
  public stockItemImageForm: FormGroup;
  fileUploadControl: FormControl = new FormControl();
  public uploader: FileUploader = new FileUploader({ url: 'https://pixsurf-api.herokuapp.com/media' });
  // public uploader: FileUploader = new FileUploader({ url: URL });
  // public hasBaseDropZoneOver: boolean = false;
  onImagesChangedSubscription: Subscription;
  images: any;
  previewImage: any;
  selectedFiles: any[];
  selectedFileName: string;
  fileToUpload: File = null;
  dataSource: FilesDataSource | null;
  displayedColumns = ['select', 'path', 'name', 'sortOrder', 'isBaseImage', 'isSmallImage', 'isThumbnail', 'exclude'];
  selectedBaseImage: any;
  selectedSmallImage: any;
  selectedThumbnail: any;
  selection = new SelectionModel<any>(true, []);

  thumbnail: boolean;
  gpThumbnail: any;

  constructor(
    private stockImageService: EcommerceStockItemService,
    private http: HttpClient,
  ) {
    this.onImagesChangedSubscription =
      this.stockImageService.onImagesChanged.subscribe(images => {
        console.log(images)
        this.images = images;
      });
  }

  trackById(index, item) {
    console.log('Track ID', item);
    return item;

    //console.log(index, item);
  }

  onChangedRadio(event, value) {
    if (event.source.checked && event.value !== event.source.checked) {
      this.images.forEach(element => {

        if (element._id == value._id) {
          switch (event.source.name) {
            case 'thumbnail':
              element.isThumbnail = true;
              break;
            case 'small-image':
              element.isSmallImage = true;
              break;
            case 'base-image':
              element.isBaseImage = true;
              break;
          }
        }
        else {
          switch (event.source.name) {
            case 'thumbnail':
              element.isThumbnail = false;
              break;
            case 'small-image':
              element.isSmallImage = false;
              break;
            case 'base-image':
              element.isBaseImage = false;
              break;
          }
        }
      });
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.images.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.images.forEach(image => this.selection.select(image));
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.stockImageService);
    // this.dataSource = new FilesDataSource(this.images);
  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSaveFiles() {
    this.selectedFiles.forEach(file => {
      var reader = new FileReader();
      reader.readAsDataURL(file); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed.
        var image = new Image({
          size: file.size,
          name: file.name,
          type: file.type,
          stockItemId: this.stockItem.id,
          lastModified: file.lastModified,
          webkitRelativePath: file.webkitRelativePath,
          uri: event.target.result
        });

        this.stockImageService.addImage(image, this.stockItem.id)
          .then((res) => {
            // Trigger the subscription with new data
            // this.stockImageService.onImagesChanged.next(res);            
            // this.stockImageService.getImages(this.stockItem.id,false,false,true);
          });
        this.removeFile(file);
      }
    });
  }

  resetUpload(event) {
    this.previewImage = null;
    this.selectedFileName = "";
  }

  removeFile(file) {
    const index = this.selectedFiles.findIndex(x => x.name == file.name);
    if (index >= 0) {
      this.selectedFiles.splice(index, 1);
    }
  }

  onSaveImage(event) {
    console.log('Save', event);
    // this.images.forEach(image => {
    //   this.stockImageService.saveImage(image._id,image);

    // })
  }

  onRemoveImage(event) {
    let error = false;
    this.selection.selected.forEach(image => {
      this.stockImageService.removeImage(image._id)
        .catch(err => {
          error = true;
        });
    });

    if (!error) {
      // this.stockImageService.getImages(this.stockItem.id,false,false,true);
      this.selection.clear();
    }
  }
}

export class FilesDataSource extends DataSource<any>
{
  constructor(private stockImageService: EcommerceStockItemService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.stockImageService.onImagesChanged;
  }

  disconnect() {
  }
}
// export class FilesDataSource extends DataSource<any> {

//   private dataSubject = new BehaviorSubject<Element[]>([]);

//   data() {
//     return this.dataSubject.value;
//   }

//   update(data) {
//     this.dataSubject.next(data);
//   }

//   constructor(data: any[]) {
//     super();
//     this.dataSubject.next(data);
//   }

//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<Element[]> {
//     return this.dataSubject;
//   }

//   disconnect() { }
// }
