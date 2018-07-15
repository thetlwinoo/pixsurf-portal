import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'px-customer-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class PxCustomerBasicComponent implements OnInit {
  @Input() customer;
  @Input() customerCategories;
  @Input() persons;
  @Input('group')
  public customerBasicForm: FormGroup;

  selectedCustomerCategoryId: string;
  selectedPrimaryContactId: string;
  selectedAlternateContactId: string;
  constructor() { }

  ngOnInit() {
  }
  
  onCustomerCategoryChanged(event?) {
    if (event) {
      this.customerBasicForm.value.customerCategories = event;
    }
  }

  onPrimaryContactChanged(event?) {
    if (event) {
      this.customerBasicForm.value.primaryContactPerson = event;
    }
  }

  onAlternateContactChanged(event?) {
    if (event) {
      this.customerBasicForm.value.alternateContactPerson = event;
    }
  }
}
