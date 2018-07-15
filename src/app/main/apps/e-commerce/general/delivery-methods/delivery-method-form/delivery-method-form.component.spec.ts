import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryMethodFormComponent } from './delivery-method-form.component';

describe('DeliveryMethodFormComponent', () => {
  let component: DeliveryMethodFormComponent;
  let fixture: ComponentFixture<DeliveryMethodFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryMethodFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryMethodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
