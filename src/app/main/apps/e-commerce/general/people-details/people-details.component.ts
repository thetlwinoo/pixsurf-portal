import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { People } from './people.model';
import { EcommercePeopleDetailsService } from './people-details.service';
import { Location } from '@angular/common';

@Component({
  selector: 'px-e-commerce-people-details',
  templateUrl: './people-details.component.html',
  styleUrls: ['./people-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PxEcommercePeopleDetailsComponent implements OnInit, OnDestroy {
  people = new People();
  onPeopleChanged: Subscription;
  onLanguageChangedSubscription: Subscription;
  pageType: string;
  peopleForm: FormGroup;
  languages: any;

  constructor(
    private peopleService: EcommercePeopleDetailsService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private location: Location
  ) {
    this.onLanguageChangedSubscription =
      this.peopleService.onLanguageChanged.subscribe(languages => {
        this.languages = languages;
      });
  }

  ngOnInit() {
    // Subscribe to update people on changes
    this.onPeopleChanged =
      this.peopleService.onPeopleChanged
        .subscribe(people => {
          if (people) {
            this.people = new People(people);
            this.pageType = 'edit';
          }
          else {
            this.pageType = 'new';
            this.people = new People({
              validFrom: new Date('2018-01-01 00:00:00.0000000'),
              validTo: new Date('9999-12-31 23:59:59.9999999')
            });
          }

          this.peopleForm = this.createPeopleForm();
        });
  }

  ngOnDestroy() {
    this.onPeopleChanged.unsubscribe();
  }

  createPeopleForm() {
    return this.formBuilder.group({
      id: [this.people.id],
      fullName: [this.people.fullName],
      preferredName: [this.people.preferredName],
      searchName: [this.people.searchName],
      isPermittedToLogon: [this.people.isPermittedToLogon],
      logonName: [this.people.logonName],
      isExternalLogonProvider: [this.people.isExternalLogonProvider],
      isSystemUser: [this.people.isSystemUser],
      isEmployee: [this.people.isEmployee],
      isSalesperson: [this.people.isSalesperson],
      userPreferences: [JSON.stringify(this.people.userPreferences)],
      phoneNumber: [this.people.phoneNumber],
      faxNumber: [this.people.faxNumber],
      emailAddress: [this.people.emailAddress],
      photo: [this.people.photo],
      customFields: [this.people.customFields],
      otherLanguages: [this.people.otherLanguages],
      lastEditedBy: [this.people.lastEditedBy],
      validFrom: [this.people.validFrom],
      validTo: [this.people.validTo]
    });
  }

  savePeople() {
    const data = this.peopleForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);

    this.peopleService.savePeople(data)
      .then(() => {
        // Trigger the subscription with new data
        this.peopleService.onPeopleChanged.next(data);

        // Show the success message
        this.snackBar.open('People saved', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      });
  }

  addPeople() {
    const data = this.peopleForm.getRawValue();
    // data.handle = FuseUtils.handleize(data.name);
    data.lastEditedBy = data.colorID;
    data.validFrom = Date.now();
    data.validTo = Date.now();
    this.peopleService.addPeople(data)
      .then((res) => {
        // Trigger the subscription with new data
        this.peopleService.onPeopleChanged.next(res);

        // Show the success message
        this.snackBar.open('People added', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });

        // Change the location with new one
        this.location.go('apps/e-commerce/people/' + this.people.id);
      });
  }
}
