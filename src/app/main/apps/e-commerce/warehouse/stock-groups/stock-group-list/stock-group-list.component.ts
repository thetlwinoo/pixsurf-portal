import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { StockGroupFormComponent } from '../stock-group-form/stock-group-form.component';
import { StockGroupsService } from '../stock-groups.service';

@Component({
  selector: 'px-stock-group-list',
  templateUrl: './stock-group-list.component.html',
  styleUrls: ['./stock-group-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class StockGroupListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() stateProvinces;

  stockGroups: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'stockGroupName', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedStockGroups: any[];
  checkboxes: {};

  onStockGroupsChangedSubscription: Subscription;
  onSelectedStockGroupsChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private stockGroupsService: StockGroupsService,
    public dialog: MatDialog
  ) {
    this.onStockGroupsChangedSubscription =
      this.stockGroupsService.onStockGroupsChanged.subscribe(stockGroups => {
        this.stockGroups = stockGroups;

        this.checkboxes = {};
        stockGroups.map(stockGroup => {
          this.checkboxes[stockGroup.id] = false;
        });
      });

    this.onSelectedStockGroupsChangedSubscription =
      this.stockGroupsService.onSelectedStockGroupsChanged.subscribe(selectedStockGroups => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedStockGroups.includes(id);
        }
        this.selectedStockGroups = selectedStockGroups;
      });

    this.onUserDataChangedSubscription =
      this.stockGroupsService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });

  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.stockGroupsService);
  }

  ngOnDestroy() {
    this.onStockGroupsChangedSubscription.unsubscribe();
    this.onSelectedStockGroupsChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editStockGroup(stockGroup) {
    this.dialogRef = this.dialog.open(StockGroupFormComponent, {
      panelClass: 'stock-group-form-dialog',
      data: {
        stockGroup: stockGroup,
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
            this.stockGroupsService.updateStockGroup(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteStockGroup(stockGroup);

            break;
        }
      });
  }

  /**
   * Delete StockGroup
   */
  deleteStockGroup(stockGroup) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stockGroupsService.deleteStockGroup(stockGroup);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(stockGroupId) {
    this.stockGroupsService.toggleSelectedStockGroup(stockGroupId);
  }

  toggleStar(stockGroupId) {
    if (this.user.starred.includes(stockGroupId)) {
      this.user.starred.splice(this.user.starred.indexOf(stockGroupId), 1);
    }
    else {
      this.user.starred.push(stockGroupId);
    }

    // this.stockGroupsService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private stockGroupsService: StockGroupsService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.stockGroupsService.onStockGroupsChanged;
  }

  disconnect() {
  }
}

