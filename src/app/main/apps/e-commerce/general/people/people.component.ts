import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { EcommercePeopleService } from './people.service';

@Component({
  selector: 'px-e-commerce-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  animations: fuseAnimations
})
export class PxEcommercePeopleComponent implements OnInit {
  people: any;
  selectedPeople: any[];
  hasSelectedPeople: boolean;

  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'fullName', 'preferredName', 'logonName', 'phoneNumber', 'emailAddress'];
  checkboxes: {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  onPeopleChangedSubscription: Subscription;
  onSelectedPeopleChangedSubscription: Subscription;

  constructor(
    private peopleService: EcommercePeopleService
  ) {
    this.onPeopleChangedSubscription =
      this.peopleService.onPeopleChanged.subscribe(people => {

        this.people = people;

        this.checkboxes = {};
        people.map(people => {
          this.checkboxes[people.id] = false;
        });
      });

    this.onSelectedPeopleChangedSubscription =
      this.peopleService.onSelectedPeopleChanged.subscribe(selectedPeople => {
        this.hasSelectedPeople = selectedPeople.length > 0;

        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedPeople.includes(id);
        }
        this.selectedPeople = selectedPeople;
      });
  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.peopleService, this.paginator, this.sort);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  onSelectedChange(id) {
    this.peopleService.toggleSelectedPeople(id);
  }
}

export class FilesDataSource extends DataSource<any>
{
  _filterChange = new BehaviorSubject('');
  _filteredDataChange = new BehaviorSubject('');

  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  constructor(
    private peopleService: EcommercePeopleService,
    private _paginator: MatPaginator,
    private _sort: MatSort
  ) {
    super();
    this.filteredData = this.peopleService.people;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.peopleService.onPeopleChanged,
      this._paginator.page,
      this._filterChange,
      this._sort.sortChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.peopleService.people.slice();

      data = this.filterData(data);

      this.filteredData = [...data];

      data = this.sortData(data);

      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  filterData(data) {
    if (!this.filter) {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }

  sortData(data): any[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'peopleName':
          [propertyA, propertyB] = [a.peopleName, b.peopleName];
          break;
        case 'unitPrice':
          [propertyA, propertyB] = [a.unitPrice, b.unitPrice];
          break;
        case 'recommendedRetailPrice':
          [propertyA, propertyB] = [a.recommendedRetailPrice, b.recommendedRetailPrice];
          break;
        case 'typicalWeightPerUnit':
          [propertyA, propertyB] = [a.typicalWeightPerUnit, b.typicalWeightPerUnit];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  disconnect() {
  }
}
