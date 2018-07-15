import { TestBed, inject } from '@angular/core/testing';

import { DeliveryMethodsService } from './delivery-methods.service';

describe('DeliveryMethodsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryMethodsService]
    });
  });

  it('should be created', inject([DeliveryMethodsService], (service: DeliveryMethodsService) => {
    expect(service).toBeTruthy();
  }));
});
