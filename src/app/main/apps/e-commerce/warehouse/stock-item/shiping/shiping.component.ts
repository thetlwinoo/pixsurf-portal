import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'px-stockitem-shipping',
  templateUrl: './shiping.component.html',
  styleUrls: ['./shiping.component.scss']
})
export class PxStockItemShipingComponent implements OnInit {
  @Input() stockItem;
  @Input('group')
  public stockItemShippingForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
