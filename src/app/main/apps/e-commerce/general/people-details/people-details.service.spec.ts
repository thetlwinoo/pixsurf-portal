import { TestBed, inject } from '@angular/core/testing';

import { PeopleDetailsService } from './people-details.service';

describe('PeopleDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeopleDetailsService]
    });
  });

  it('should be created', inject([PeopleDetailsService], (service: PeopleDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
