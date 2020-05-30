import { TestBed } from '@angular/core/testing';

import { TripRetrievalServiceService } from './trip-retrieval-service.service';

describe('TripRetrievalServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TripRetrievalServiceService = TestBed.get(TripRetrievalServiceService);
    expect(service).toBeTruthy();
  });
});
