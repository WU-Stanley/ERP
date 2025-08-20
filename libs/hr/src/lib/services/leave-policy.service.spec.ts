/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeavePolicyService } from './leave-policy.service';

describe('Service: LeavePolicy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeavePolicyService]
    });
  });

  it('should ...', inject([LeavePolicyService], (service: LeavePolicyService) => {
    expect(service).toBeTruthy();
  }));
});
