import { TestBed } from '@angular/core/testing';

import { JobSchedulerService } from './job-scheduler.service';

describe('JobSchedulerService', () => {
  let service: JobSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
