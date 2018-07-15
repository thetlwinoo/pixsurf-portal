import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'px-stockitem-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class PxStockItemBasicComponent implements OnInit {
  @Input() stockItem;
  @Input() pageType;
  @Input() suppliers;
  @Input() colors;
  @Input() packageTypes;
  @Input() stockGroups;
  @Input('group')
  public stockItemBasicForm: FormGroup;

  selectedSupplierId: string;
  selectedColorId: string;
  selectedStockGroups: string[] = [];

  constructor() { }

  ngOnInit() {
    this.selectedSupplierId = this.stockItem.supplierID._id;
    this.selectedColorId = this.stockItem.colorID._id;
    this.selectedStockGroups = this.stockItem.stockGroups;
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add tag
    if (value) {
      this.stockItem.tags.push(value);
      this.stockItemBasicForm.markAsDirty();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag) {
    const index = this.stockItem.tags.indexOf(tag);

    if (index >= 0) {
      this.stockItem.tags.splice(index, 1);
      this.stockItemBasicForm.markAsDirty();
    }
  }
}
