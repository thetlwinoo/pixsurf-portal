import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PxEcommerceStockItemsComponent } from './stock-items.component';

describe('PxEcommerceStockItemsComponent', () => {
  let component: PxEcommerceStockItemsComponent;
  let fixture: ComponentFixture<PxEcommerceStockItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PxEcommerceStockItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PxEcommerceStockItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
