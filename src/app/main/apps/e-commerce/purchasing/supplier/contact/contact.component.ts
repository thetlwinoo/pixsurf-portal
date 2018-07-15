import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'px-supplier-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  @Output() primaryContact: EventEmitter<any> = new EventEmitter<any>();
  @Output() alternateContact: EventEmitter<any> = new EventEmitter<any>();
  @Input() supplier;
  @Input() persons;
  @Input('group')
  public supplierContactForm: FormGroup;

  primaryContactControl: FormControl = new FormControl();
  alternateContactControl: FormControl = new FormControl();

  currentPrimaryContact: any;
  currentAlternateContact: any;
  selectedPrimaryContactId: string;
  selectedAlternateContactId: string;

  filteredPrimaryContactOptions: Observable<string[]>;
  filteredAlternateContactOptions: Observable<string[]>;

  constructor() { }

  ngOnInit() {
    this.currentPrimaryContact = this.persons.filter(s => s._id == this.supplier.primaryContactPersonID._id)[0];
    this.currentAlternateContact = this.persons.filter(s => s._id == this.supplier.alternateContactPersonID._id)[0];
    this.filteredPrimaryContactOptions = this.primaryContactControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

    this.filteredAlternateContactOptions = this.alternateContactControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }

  filter(val: any): any[] {
    if (!val) return this.persons;

    var checkText = val.fullName || val;

    return this.persons.filter(person =>
      person.fullName.toLowerCase().includes(checkText.toLowerCase()));
  }

  displayFullName(value?: any): string | undefined {
    return value ? value.fullName : undefined;
  }
}
