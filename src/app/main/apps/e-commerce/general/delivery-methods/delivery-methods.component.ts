import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { fuseAnimations } from '@fuse/animations';

import { DeliveryMethodFormComponent } from './delivery-method-form/delivery-method-form.component';
import { DeliveryMethodsService } from './delivery-methods.service';

@Component({
  selector: 'px-delivery-methods',
  templateUrl: './delivery-methods.component.html',
  styleUrls: ['./delivery-methods.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DeliveryMethodsComponent implements OnInit, OnDestroy {

  hasSelectedDeliveryMethods: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedDeliveryMethodsChangedSubscription: Subscription;

  constructor(
    private deliveryMethodsService: DeliveryMethodsService,
    public dialog: MatDialog
  ) {
    this.searchInput = new FormControl('');
  }

  newDeliveryMethod() {
    this.dialogRef = this.dialog.open(DeliveryMethodFormComponent, {
      panelClass: 'delivery-method-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }

        this.deliveryMethodsService.addDeliveryMethod(response.getRawValue());
      });
  }

  ngOnInit() {
    this.onSelectedDeliveryMethodsChangedSubscription =
      this.deliveryMethodsService.onSelectedDeliveryMethodsChanged
        .subscribe(selectedDeliveryMethods => {
          this.hasSelectedDeliveryMethods = selectedDeliveryMethods.length > 0;
        });

    this.searchInput.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.deliveryMethodsService.onSearchTextChanged.next(searchText);
      });
  }

  ngOnDestroy() {
    this.onSelectedDeliveryMethodsChangedSubscription.unsubscribe();
  }

}
