import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PxEcommerceSuppliersComponent } from './suppliers.component';

describe('PxEcommerceSuppliersComponent', () => {
  let component: PxEcommerceSuppliersComponent;
  let fixture: ComponentFixture<PxEcommerceSuppliersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PxEcommerceSuppliersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PxEcommerceSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
