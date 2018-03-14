import { TestBed, inject } from '@angular/core/testing';

import { AuthenticatedHttpService } from './authenticated-http.service';

describe('AuthenticatedHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticatedHttpService]
    });
  });

  it('should be created', inject([AuthenticatedHttpService], (service: AuthenticatedHttpService) => {
    expect(service).toBeTruthy();
  }));
});
