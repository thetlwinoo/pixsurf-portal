import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressTypesComponent } from './address-types.component';

describe('AddressTypesComponent', () => {
  let component: AddressTypesComponent;
  let fixture: ComponentFixture<AddressTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
