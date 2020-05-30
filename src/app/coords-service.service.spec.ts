import { TestBed } from '@angular/core/testing';

import { CoordsServiceService } from './coords-service.service';

describe('CoordsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoordsServiceService = TestBed.get(CoordsServiceService);
    expect(service).toBeTruthy();
  });
});
