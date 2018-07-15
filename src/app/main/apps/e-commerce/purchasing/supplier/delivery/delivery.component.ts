import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'px-supplier-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  @Input() supplier;
  @Input() deliveryMethods;
  @Input() cities;
  @Input('group')  
  public supplierDeliveryForm: FormGroup;

  selectedDeliveryMethodId: string;
  selectedDeliveryCityId: string;
  selectedPostalCityId: string;

  constructor() { }

  ngOnInit() {
    this.selectedDeliveryMethodId = this.supplier.deliveryMethodID._id;
    this.selectedDeliveryCityId = this.supplier.deliveryCityID._id;
    this.selectedPostalCityId = this.supplier.postalCityID._id;
  }

  onDeliveryMethodChanged(event?) {
    if (event) {
      this.supplierDeliveryForm.value.deliveryMethodID = event;
    }
  }

  onDeliveryCityChanged(event?) {
    if (event) {
      this.supplierDeliveryForm.value.deliveryCityID = event;
    }
  }

  onPostalCityChanged(event?) {
    if (event) {
      this.supplierDeliveryForm.value.postalCityID = event;
    }
  }
}
