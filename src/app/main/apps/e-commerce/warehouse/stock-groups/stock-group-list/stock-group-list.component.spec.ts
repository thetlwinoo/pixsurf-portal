import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGroupListComponent } from './stock-group-list.component';

describe('StockGroupListComponent', () => {
  let component: StockGroupListComponent;
  let fixture: ComponentFixture<StockGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
