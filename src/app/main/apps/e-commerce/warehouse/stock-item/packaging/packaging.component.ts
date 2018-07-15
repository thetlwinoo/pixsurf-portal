import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'px-stock-item-packaging',
  templateUrl: './packaging.component.html',
  styleUrls: ['./packaging.component.scss']
})
export class PackagingComponent implements OnInit {
  @Input() stockItem;
  @Input() packageTypes;
  @Input('group')
  public stockItemPackagingForm: FormGroup;

  selectedUnitPackageId: string;
  selectedOuterPackageId: string;

  constructor() {
  }

  ngOnInit() {
    this.selectedUnitPackageId = this.stockItem.unitPackageID._id;
    this.selectedOuterPackageId = this.stockItem.outerPackageID._id;
  }
}
