import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ColorFormComponent } from '../color-form/color-form.component';
import { ColorsService } from '../colors.service';

@Component({
  selector: 'px-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ColorListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() stateProvinces;

  colors: any;  
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'colorCode', 'colorName', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedColors: any[];
  checkboxes: {};

  onColorsChangedSubscription: Subscription;  
  onSelectedColorsChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private colorsService: ColorsService,
    public dialog: MatDialog
  ) {
    this.onColorsChangedSubscription =
      this.colorsService.onColorsChanged.subscribe(colors => {
        this.colors = colors;

        this.checkboxes = {};
        colors.map(color => {
          this.checkboxes[color.id] = false;
        });
      });

    this.onSelectedColorsChangedSubscription =
      this.colorsService.onSelectedColorsChanged.subscribe(selectedColors => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedColors.includes(id);
        }
        this.selectedColors = selectedColors;
      });

    this.onUserDataChangedSubscription =
      this.colorsService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });    

  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.colorsService);
  }

  ngOnDestroy() {
    this.onColorsChangedSubscription.unsubscribe();
    this.onSelectedColorsChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editColor(color) {
    this.dialogRef = this.dialog.open(ColorFormComponent, {
      panelClass: 'color-form-dialog',
      data: {
        color: color,        
        stateProvinces: this.stateProvinces,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        switch (actionType) {
          /**
           * Save
           */
          case 'save':            
            this.colorsService.updateColor(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteColor(color);

            break;
        }
      });
  }

  /**
   * Delete Color
   */
  deleteColor(color) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.colorsService.deleteColor(color);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(colorId) {
    this.colorsService.toggleSelectedColor(colorId);
  }

  toggleStar(colorId) {
    if (this.user.starred.includes(colorId)) {
      this.user.starred.splice(this.user.starred.indexOf(colorId), 1);
    }
    else {
      this.user.starred.push(colorId);
    }

    // this.colorsService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private colorsService: ColorsService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.colorsService.onColorsChanged;
  }

  disconnect() {
  }
}

