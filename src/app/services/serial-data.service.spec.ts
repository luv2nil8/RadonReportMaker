import { TestBed } from '@angular/core/testing';

import { SerialDataService } from './serial-data.service';

describe('SerialDataService', () => {
  let service: SerialDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SerialDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
