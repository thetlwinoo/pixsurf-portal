import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockHoldingComponent } from './stock-holding.component';

describe('StockHoldingComponent', () => {
  let component: StockHoldingComponent;
  let fixture: ComponentFixture<StockHoldingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockHoldingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockHoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
