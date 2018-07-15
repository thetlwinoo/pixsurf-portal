import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'px-stockitem-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PxStockItemPricingComponent implements OnInit {
  @Input() stockItem;
  @Input('group')
  public stockItemPricingForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
