import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTypeFormComponent } from './package-type-form.component';

describe('PackageTypeFormComponent', () => {
  let component: PackageTypeFormComponent;
  let fixture: ComponentFixture<PackageTypeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageTypeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
