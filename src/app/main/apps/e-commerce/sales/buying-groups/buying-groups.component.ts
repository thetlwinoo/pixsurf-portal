import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { BuyingGroupFormComponent } from './buying-group-form/buying-group-form.component';
import { BuyingGroupsService } from './buying-groups.service';

@Component({
  selector: 'px-buying-groups',
  templateUrl: './buying-groups.component.html',
  styleUrls: ['./buying-groups.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BuyingGroupsComponent implements OnInit, OnDestroy {

  hasSelectedBuyingGroups: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedBuyingGroupsChangedSubscription: Subscription;

  constructor(
    private buyingGroupsService: BuyingGroupsService,
    public dialog: MatDialog
  ) {
    this.searchInput = new FormControl('');
  }

  newBuyingGroup() {
    this.dialogRef = this.dialog.open(BuyingGroupFormComponent, {
      panelClass: 'buying-group-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }

        this.buyingGroupsService.addBuyingGroup(response.getRawValue());
      });
  }

  ngOnInit() {
    this.onSelectedBuyingGroupsChangedSubscription =
      this.buyingGroupsService.onSelectedBuyingGroupsChanged
        .subscribe(selectedBuyingGroups => {
          this.hasSelectedBuyingGroups = selectedBuyingGroups.length > 0;
        });

    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.buyingGroupsService.onSearchTextChanged.next(searchText);
      });
  }

  ngOnDestroy() {
    this.onSelectedBuyingGroupsChangedSubscription.unsubscribe();
  }

}
