import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMethodListComponent } from './delivery-method-list.component';

describe('DeliveryMethodListComponent', () => {
  let component: DeliveryMethodListComponent;
  let fixture: ComponentFixture<DeliveryMethodListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryMethodListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryMethodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
