import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StateProvinceListComponent } from './state-province-list.component';

describe('StateProvinceListComponent', () => {
  let component: StateProvinceListComponent;
  let fixture: ComponentFixture<StateProvinceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StateProvinceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateProvinceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
