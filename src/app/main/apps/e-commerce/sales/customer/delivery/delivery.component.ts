import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'px-customer-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
  @Input() customer;
  @Input() deliveryMethods;
  @Input() cities;
  @Input('group')  
  public customerDeliveryForm: FormGroup;

  selectedDeliveryMethodId: string;
  selectedDeliveryCityId: string;
  selectedPostalCityId: string;

  constructor() { }

  ngOnInit() {
    this.selectedDeliveryMethodId = this.customer.deliveryMethodID._id;
    this.selectedDeliveryCityId = this.customer.deliveryCityID._id;
    this.selectedPostalCityId = this.customer.postalCityID._id;
  }

  onDeliveryMethodChanged(event?) {
    if (event) {
      this.customerDeliveryForm.value.deliveryMethodID = event;
    }
  }

  onDeliveryCityChanged(event?) {
    if (event) {
      this.customerDeliveryForm.value.deliveryCityID = event;
    }
  }

  onPostalCityChanged(event?) {
    if (event) {
      this.customerDeliveryForm.value.postalCityID = event;
    }
  }
}
