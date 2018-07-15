import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGroupSelectedBarComponent } from './selected-bar.component';

describe('StockGroupSelectedBarComponent', () => {
  let component: StockGroupSelectedBarComponent;
  let fixture: ComponentFixture<StockGroupSelectedBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockGroupSelectedBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockGroupSelectedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
