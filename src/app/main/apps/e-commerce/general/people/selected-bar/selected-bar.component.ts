import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { EcommercePeopleService } from '../people.service';

@Component({
  selector: 'px-people-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class PxPeopleSelectedBarComponent {

  selectedPeople: string[];
  hasSelectedPeople: boolean;
  isIndeterminate: boolean;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private peopleService: EcommercePeopleService,
    public dialog: MatDialog
  ) {
    this.peopleService.onSelectedPeopleChanged
      .subscribe(selectedPeople => {
        this.selectedPeople = selectedPeople;
        setTimeout(() => {
          this.hasSelectedPeople = selectedPeople.length > 0;
          this.isIndeterminate = (selectedPeople.length !== this.peopleService.people.length && selectedPeople.length > 0);
        }, 0);
      });

  }

  selectAll() {
    this.peopleService.selectPeople();
  }

  deselectAll() {
    this.peopleService.deselectPeople();
  }

  deleteSelectedPeople() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected people?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.peopleService.deleteSelectedPeople();
      }
      this.confirmDialogRef = null;
    });
  }
}
