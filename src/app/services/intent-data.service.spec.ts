import { TestBed } from '@angular/core/testing';

import { IntentDataService } from './intent-data.service';

describe('IntentDataService', () => {
  let service: IntentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
