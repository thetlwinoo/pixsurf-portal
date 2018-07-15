import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'px-people-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  @Input() people;
  @Input('group')
  public peopleConfigForm: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
