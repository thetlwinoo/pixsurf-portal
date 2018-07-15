import { TestBed, inject } from '@angular/core/testing';

import { PackageTypesService } from './package-types.service';

describe('PackageTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackageTypesService]
    });
  });

  it('should be created', inject([PackageTypesService], (service: PackageTypesService) => {
    expect(service).toBeTruthy();
  }));
});
