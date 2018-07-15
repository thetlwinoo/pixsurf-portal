import { TestBed, inject } from '@angular/core/testing';

import { AddressTypesService } from './address-types.service';

describe('AddressTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressTypesService]
    });
  });

  it('should be created', inject([AddressTypesService], (service: AddressTypesService) => {
    expect(service).toBeTruthy();
  }));
});
