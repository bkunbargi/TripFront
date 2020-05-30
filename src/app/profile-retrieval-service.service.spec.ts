import { TestBed } from '@angular/core/testing';

import { ProfileRetrievalServiceService } from './profile-retrieval-service.service';

describe('ProfileRetrievalServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileRetrievalServiceService = TestBed.get(ProfileRetrievalServiceService);
    expect(service).toBeTruthy();
  });
});
