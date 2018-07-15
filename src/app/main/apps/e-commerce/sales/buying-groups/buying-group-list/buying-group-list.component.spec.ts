import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingGroupListComponent } from './buying-group-list.component';

describe('BuyingGroupListComponent', () => {
  let component: BuyingGroupListComponent;
  let fixture: ComponentFixture<BuyingGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyingGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyingGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
