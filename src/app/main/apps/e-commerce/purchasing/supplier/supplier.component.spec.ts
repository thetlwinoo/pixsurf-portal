import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PxEcommerceSupplierComponent } from './supplier.component';

describe('PxEcommerceSupplierComponent', () => {
  let component: PxEcommerceSupplierComponent;
  let fixture: ComponentFixture<PxEcommerceSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PxEcommerceSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PxEcommerceSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
