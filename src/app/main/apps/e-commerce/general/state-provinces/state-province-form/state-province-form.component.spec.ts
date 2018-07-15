import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateProvinceFormComponent } from './state-province-form.component';

describe('StateProvinceFormComponent', () => {
  let component: StateProvinceFormComponent;
  let fixture: ComponentFixture<StateProvinceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateProvinceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateProvinceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
