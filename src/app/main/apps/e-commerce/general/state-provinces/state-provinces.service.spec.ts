import { TestBed, inject } from '@angular/core/testing';

import { StateProvincesService } from './state-provinces.service';

describe('StateProvincesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateProvincesService]
    });
  });

  it('should be created', inject([StateProvincesService], (service: StateProvincesService) => {
    expect(service).toBeTruthy();
  }));
});
