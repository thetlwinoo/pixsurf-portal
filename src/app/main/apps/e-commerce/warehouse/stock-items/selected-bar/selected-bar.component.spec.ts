import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PxStockItemSelectedBarComponent } from './selected-bar.component';

describe('PxStockItemSelectedBarComponent', () => {
  let component: PxStockItemSelectedBarComponent;
  let fixture: ComponentFixture<PxStockItemSelectedBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PxStockItemSelectedBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PxStockItemSelectedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
