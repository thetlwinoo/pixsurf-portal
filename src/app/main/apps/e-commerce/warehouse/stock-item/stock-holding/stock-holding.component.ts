import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'px-stock-item-holding',
  templateUrl: './stock-holding.component.html',
  styleUrls: ['./stock-holding.component.scss']
})
export class StockHoldingComponent implements OnInit {
  @Input() stockItem;
  @Input('group')
  public stockHoldingForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
