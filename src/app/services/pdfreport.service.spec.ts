import { TestBed } from '@angular/core/testing';

import { PDFReportService } from './pdfreport.service';

describe('PDFReportService', () => {
  let service: PDFReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PDFReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
