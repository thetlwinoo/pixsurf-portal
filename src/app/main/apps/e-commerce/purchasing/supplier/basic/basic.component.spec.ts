import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PxSupplierBasicComponent } from './basic.component';

describe('PxSupplierBasicComponent', () => {
  let component: PxSupplierBasicComponent;
  let fixture: ComponentFixture<PxSupplierBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PxSupplierBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PxSupplierBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
