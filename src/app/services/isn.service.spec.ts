import { TestBed } from '@angular/core/testing';

import { IsnService } from './isn.service';

describe('IsnService', () => {
  let service: IsnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
