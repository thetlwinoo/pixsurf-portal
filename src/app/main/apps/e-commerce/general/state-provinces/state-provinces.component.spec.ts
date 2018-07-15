import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateProvincesComponent } from './state-provinces.component';

describe('StateProvincesComponent', () => {
  let component: StateProvincesComponent;
  let fixture: ComponentFixture<StateProvincesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateProvincesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateProvincesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
