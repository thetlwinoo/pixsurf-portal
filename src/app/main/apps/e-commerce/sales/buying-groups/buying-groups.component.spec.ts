import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingGroupsComponent } from './buying-groups.component';

describe('BuyingGroupsComponent', () => {
  let component: BuyingGroupsComponent;
  let fixture: ComponentFixture<BuyingGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyingGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyingGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
