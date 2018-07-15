import { TestBed, inject } from '@angular/core/testing';

import { SupplierCategoriesService } from './supplier-categories.service';

describe('SupplierCategoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplierCategoriesService]
    });
  });

  it('should be created', inject([SupplierCategoriesService], (service: SupplierCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
