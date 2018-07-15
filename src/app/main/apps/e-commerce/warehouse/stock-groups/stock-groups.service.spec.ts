import { TestBed, inject } from '@angular/core/testing';

import { StockGroupsService } from './stock-groups.service';

describe('StockGroupsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockGroupsService]
    });
  });

  it('should be created', inject([StockGroupsService], (service: StockGroupsService) => {
    expect(service).toBeTruthy();
  }));
});
