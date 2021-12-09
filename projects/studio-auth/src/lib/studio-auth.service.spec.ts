import { TestBed } from '@angular/core/testing';

import { StudioAuthService } from './studio-auth.service';

describe('StudioAuthService', () => {
  let service: StudioAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudioAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
