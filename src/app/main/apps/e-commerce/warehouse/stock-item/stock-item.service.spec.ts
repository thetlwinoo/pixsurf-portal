import { TestBed, inject } from '@angular/core/testing';

import { EcommerceStockItemService } from './stock-item.service';

describe('StockItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcommerceStockItemService]
    });
  });

  it('should be created', inject([EcommerceStockItemService], (service: EcommerceStockItemService) => {
    expect(service).toBeTruthy();
  }));
});
