import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCategoryListComponent } from './supplier-category-list.component';

describe('SupplierCategoryListComponent', () => {
  let component: SupplierCategoryListComponent;
  let fixture: ComponentFixture<SupplierCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
