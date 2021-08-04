import { TestBed } from '@angular/core/testing';

import { InventoryCountService } from './inventory-count.service';

describe('InventoryCountService', () => {
  let service: InventoryCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
