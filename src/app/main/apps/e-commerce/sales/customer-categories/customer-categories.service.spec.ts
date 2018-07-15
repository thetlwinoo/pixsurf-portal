import { TestBed, inject } from '@angular/core/testing';

import { CustomerCategoriesService } from './customer-categories.service';

describe('CustomerCategoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerCategoriesService]
    });
  });

  it('should be created', inject([CustomerCategoriesService], (service: CustomerCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
