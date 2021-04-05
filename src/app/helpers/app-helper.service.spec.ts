import { TestBed } from '@angular/core/testing';

import { AppHelperService } from './app-helper.service';

describe('AppHelperService', () => {
  let service: AppHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
