import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockGroupFormComponent } from './stock-group-form.component';

describe('StockGroupFormComponent', () => {
  let component: StockGroupFormComponent;
  let fixture: ComponentFixture<StockGroupFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockGroupFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
