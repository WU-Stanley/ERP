/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeaveApprovalService } from './leave-approval.service';

describe('Service: LeaveApproval', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveApprovalService]
    });
  });

  it('should ...', inject([LeaveApprovalService], (service: LeaveApprovalService) => {
    expect(service).toBeTruthy();
  }));
});
