import { TestBed, inject } from '@angular/core/testing';

import { EcommerceStockItemsService } from './stock-items.service';

describe('StockItemsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcommerceStockItemsService]
    });
  });

  it('should be created', inject([EcommerceStockItemsService], (service: EcommerceStockItemsService) => {
    expect(service).toBeTruthy();
  }));
});
