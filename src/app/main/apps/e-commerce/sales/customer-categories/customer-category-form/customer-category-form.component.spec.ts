import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCategoryFormComponent } from './customer-category-form.component';

describe('CustomerCategoryFormComponent', () => {
  let component: CustomerCategoryFormComponent;
  let fixture: ComponentFixture<CustomerCategoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCategoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
