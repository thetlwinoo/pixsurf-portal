import { TestBed, inject } from '@angular/core/testing';

import { EcommerceSuppliersService } from './suppliers.service';

describe('EcommerceSuppliersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcommerceSuppliersService]
    });
  });

  it('should be created', inject([EcommerceSuppliersService], (service: EcommerceSuppliersService) => {
    expect(service).toBeTruthy();
  }));
});
