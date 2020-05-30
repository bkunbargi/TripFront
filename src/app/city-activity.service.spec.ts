import { TestBed } from '@angular/core/testing';

import { CityActivityService } from './city-activity.service';

describe('CityActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CityActivityService = TestBed.get(CityActivityService);
    expect(service).toBeTruthy();
  });
});
