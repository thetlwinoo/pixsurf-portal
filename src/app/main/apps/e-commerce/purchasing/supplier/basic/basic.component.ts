import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'px-supplier-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class PxSupplierBasicComponent implements OnInit {
  @Input() supplier;
  @Input() supplierCategories;
  @Input() persons;
  @Input('group')
  public supplierBasicForm: FormGroup;

  selectedSupplierCategoryId: string;
  selectedPrimaryContactId: string;
  selectedAlternateContactId: string;
  constructor() { }

  ngOnInit() {
  }
  
  onSupplierCategoryChanged(event?) {
    if (event) {
      this.supplierBasicForm.value.supplierCategoryID = event;
    }
  }

  onPrimaryContactChanged(event?) {
    if (event) {
      this.supplierBasicForm.value.primaryContactPersonID = event;
    }
  }

  onAlternateContactChanged(event?) {
    if (event) {
      this.supplierBasicForm.value.alternateContactPersonID = event;
    }
  }
}
