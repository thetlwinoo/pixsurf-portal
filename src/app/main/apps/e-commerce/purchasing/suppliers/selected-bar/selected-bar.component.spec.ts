import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PxSupplierSelectedBarComponent } from './selected-bar.component';

describe('PxSupplierSelectedBarComponent', () => {
  let component: PxSupplierSelectedBarComponent;
  let fixture: ComponentFixture<PxSupplierSelectedBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PxSupplierSelectedBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PxSupplierSelectedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
