import { TestBed, inject } from '@angular/core/testing';

import { EcommerceSupplierService } from './supplier.service';

describe('EcommerceSupplierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcommerceSupplierService]
    });
  });

  it('should be created', inject([EcommerceSupplierService], (service: EcommerceSupplierService) => {
    expect(service).toBeTruthy();
  }));
});
