import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCategoryFormComponent } from './supplier-category-form.component';

describe('SupplierCategoryFormComponent', () => {
  let component: SupplierCategoryFormComponent;
  let fixture: ComponentFixture<SupplierCategoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCategoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
