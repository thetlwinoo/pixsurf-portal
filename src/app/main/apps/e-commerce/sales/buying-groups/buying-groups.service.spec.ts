import { TestBed, inject } from '@angular/core/testing';

import { BuyingGroupsService } from './buying-groups.service';

describe('BuyingGroupsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuyingGroupsService]
    });
  });

  it('should be created', inject([BuyingGroupsService], (service: BuyingGroupsService) => {
    expect(service).toBeTruthy();
  }));
});
