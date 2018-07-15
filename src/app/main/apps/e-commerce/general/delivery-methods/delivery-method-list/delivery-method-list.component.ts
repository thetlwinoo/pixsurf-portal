import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { DeliveryMethodFormComponent } from '../delivery-method-form/delivery-method-form.component';
import { DeliveryMethodsService } from '../delivery-methods.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'px-delivery-method-list',
  templateUrl: './delivery-method-list.component.html',
  styleUrls: ['./delivery-method-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DeliveryMethodListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @Input() countries;

  deliveryMethods: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'deliveryMethodName', 'lastEditedBy', 'validFrom', 'validTo'];
  selectedDeliveryMethods: any[];
  checkboxes: {};

  onDeliveryMethodsChangedSubscription: Subscription;
  onSelectedDeliveryMethodsChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private deliveryMethodsService: DeliveryMethodsService,
    public dialog: MatDialog
  ) {
    this.onDeliveryMethodsChangedSubscription =
      this.deliveryMethodsService.onDeliveryMethodsChanged.subscribe(deliveryMethods => {
        this.deliveryMethods = deliveryMethods;

        this.checkboxes = {};
        deliveryMethods.map(deliveryMethod => {
          this.checkboxes[deliveryMethod.id] = false;
        });
      });

    this.onSelectedDeliveryMethodsChangedSubscription =
      this.deliveryMethodsService.onSelectedDeliveryMethodsChanged.subscribe(selectedDeliveryMethods => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedDeliveryMethods.includes(id);
        }
        this.selectedDeliveryMethods = selectedDeliveryMethods;
      });

    this.onUserDataChangedSubscription =
      this.deliveryMethodsService.onUserDataChanged.subscribe(user => {
        this.user = user;
      });
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.deliveryMethodsService);
  }

  ngOnDestroy() {
    this.onDeliveryMethodsChangedSubscription.unsubscribe();
    this.onSelectedDeliveryMethodsChangedSubscription.unsubscribe();
    this.onUserDataChangedSubscription.unsubscribe();
  }

  editDeliveryMethod(deliveryMethod) {
    this.dialogRef = this.dialog.open(DeliveryMethodFormComponent, {
      panelClass: 'delivery-method-form-dialog',
      data: {
        deliveryMethod: deliveryMethod,
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

            this.deliveryMethodsService.updateDeliveryMethod(formData.getRawValue());

            break;
          /**
           * Delete
           */
          case 'delete':

            this.deleteDeliveryMethod(deliveryMethod);

            break;
        }
      });
  }

  /**
   * Delete DeliveryMethods
   */
  deleteDeliveryMethod(deliveryMethod) {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deliveryMethodsService.deleteDeliveryMethod(deliveryMethod);
      }
      this.confirmDialogRef = null;
    });

  }

  onSelectedChange(deliveryMethodId) {
    this.deliveryMethodsService.toggleSelectedDeliveryMethod(deliveryMethodId);
  }

  toggleStar(deliveryMethodId) {
    if (this.user.starred.includes(deliveryMethodId)) {
      this.user.starred.splice(this.user.starred.indexOf(deliveryMethodId), 1);
    }
    else {
      this.user.starred.push(deliveryMethodId);
    }

    // this.deliveryMethodsService.updateUserData(this.user);
  }

}
export class FilesDataSource extends DataSource<any>
{
  constructor(private deliveryMethodsService: DeliveryMethodsService) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    return this.deliveryMethodsService.onDeliveryMethodsChanged;
  }

  disconnect() {
  }
}

