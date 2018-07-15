import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { BuyingGroupsService } from '../buying-groups.service';

@Component({
  selector: 'px-buying-group-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class BuyingGroupSelectedBarComponent {

  selectedBuyingGroups: string[];
  hasSelectedBuyingGroups: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private buyingGroupsService: BuyingGroupsService,
    public dialog: MatDialog
  ) {
    this.buyingGroupsService.onSelectedBuyingGroupsChanged
      .subscribe(selectedBuyingGroups => {
        this.selectedBuyingGroups = selectedBuyingGroups;
        setTimeout(() => {
          this.hasSelectedBuyingGroups = selectedBuyingGroups.length > 0;
          this.isIndeterminate = (selectedBuyingGroups.length !== this.buyingGroupsService.buyingGroups.length && selectedBuyingGroups.length > 0);
        }, 0);
      });

  }

  selectAll() {
    this.buyingGroupsService.selectBuyingGroups();
  }

  deselectAll() {
    this.buyingGroupsService.deselectBuyingGroups();
  }

  deleteSelectedBuyingGroups() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected state provinces?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.buyingGroupsService.deleteSelectedBuyingGroups();
      }
      this.confirmDialogRef = null;
    });
  }

}
