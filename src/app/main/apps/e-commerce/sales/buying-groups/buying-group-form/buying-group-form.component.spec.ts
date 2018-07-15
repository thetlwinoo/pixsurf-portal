import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingGroupFormComponent } from './buying-group-form.component';

describe('BuyingGroupFormComponent', () => {
  let component: BuyingGroupFormComponent;
  let fixture: ComponentFixture<BuyingGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyingGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyingGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
