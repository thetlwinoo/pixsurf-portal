import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { BuyingGroupFormComponent } from '../buying-group-form/buying-group-form.component';
import { BuyingGroupsService } from '../buying-groups.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'px-buying-group-list',
  templateUrl: './buying-group-list.component.html',
  styleUrls: ['./buying-group-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BuyingGroupListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() countries;

  buyingGroups: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'buyingGroupName', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedBuyingGroups: any[];
  checkboxes: {};

  onBuyingGroupsChangedSubscription: Subscription;
  onSelectedBuyingGroupsChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private buyingGroupsService: BuyingGroupsService,
    public dialog: MatDialog
  ) {
    this.onBuyingGroupsChangedSubscription =
      this.buyingGroupsService.onBuyingGroupsChanged.subscribe(buyingGroups => {
        this.buyingGroups = buyingGroups;

        this.checkboxes = {};
        buyingGroups.map(buyingGroup => {
          this.checkboxes[buyingGroup.id] = false;
        });
      });

    this.onSelectedBuyingGroupsChangedSubscription =
      this.buyingGroupsService.onSelectedBuyingGroupsChanged.subscribe(selectedBuyingGroups => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedBuyingGroups.includes(id);
        }
        this.selectedBuyingGroups = selectedBuyingGroups;
      });

    this.onUserDataChangedSubscription =
      this.buyingGroupsService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.buyingGroupsService);
  }

  ngOnDestroy() {
    this.onBuyingGroupsChangedSubscription.unsubscribe();
    this.onSelectedBuyingGroupsChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editBuyingGroup(buyingGroup) {
    this.dialogRef = this.dialog.open(BuyingGroupFormComponent, {
      panelClass: 'buying-group-form-dialog',
      data: {
        buyingGroup: buyingGroup,
        countries: this.countries,
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

            this.buyingGroupsService.updateBuyingGroup(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteBuyingGroup(buyingGroup);

            break;
        }
      });
  }

  /**
   * Delete BuyingGroups
   */
  deleteBuyingGroup(buyingGroup) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buyingGroupsService.deleteBuyingGroup(buyingGroup);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(buyingGroupId) {
    this.buyingGroupsService.toggleSelectedBuyingGroup(buyingGroupId);
  }

  toggleStar(buyingGroupId) {
    if (this.user.starred.includes(buyingGroupId)) {
      this.user.starred.splice(this.user.starred.indexOf(buyingGroupId), 1);
    }
    else {
      this.user.starred.push(buyingGroupId);
    }

    // this.buyingGroupsService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private buyingGroupsService: BuyingGroupsService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.buyingGroupsService.onBuyingGroupsChanged;
  }

  disconnect() {
  }
}

