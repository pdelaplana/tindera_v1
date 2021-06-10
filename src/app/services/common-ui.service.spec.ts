import { TestBed } from '@angular/core/testing';

import { CommonUIService } from './common-ui.service';

describe('CommonUIService', () => {
  let service: CommonUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
