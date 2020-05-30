import { TestBed } from '@angular/core/testing';

import { DatehandlerService } from './datehandler.service';

describe('DatehandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatehandlerService = TestBed.get(DatehandlerService);
    expect(service).toBeTruthy();
  });
});
