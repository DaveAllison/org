import { TestBed } from '@angular/core/testing';

import { FinisherGuard } from './finisher.guard';

describe('FinisherGuard', () => {
  let guard: FinisherGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FinisherGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
