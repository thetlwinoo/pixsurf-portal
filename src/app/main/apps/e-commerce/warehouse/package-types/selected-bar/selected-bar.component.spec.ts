import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTypeSelectedBarComponent } from './selected-bar.component';

describe('PackageTypeSelectedBarComponent', () => {
  let component: PackageTypeSelectedBarComponent;
  let fixture: ComponentFixture<PackageTypeSelectedBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageTypeSelectedBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTypeSelectedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
