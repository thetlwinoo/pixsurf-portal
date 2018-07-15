import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'px-people-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class PxPeopleBasicComponent implements OnInit {
  @Input() people;
  @Input() languages;
  @Input('group')
  public peopleBasicForm: FormGroup;

  selectedLanguages: any[];

  constructor() { }

  ngOnInit() {
    this.selectedLanguages = this.people.otherLanguages;
  }  

  onLanguageChanged(event) {
    // console.log(event);
  }
}
