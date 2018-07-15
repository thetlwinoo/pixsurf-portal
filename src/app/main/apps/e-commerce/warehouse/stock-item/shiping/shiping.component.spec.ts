import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipingComponent } from './shiping.component';

describe('ShipingComponent', () => {
  let component: ShipingComponent;
  let fixture: ComponentFixture<ShipingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
