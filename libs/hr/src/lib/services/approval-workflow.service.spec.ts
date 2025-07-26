/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApprovalWorkflowService } from './approval-workflow.service';

describe('Service: ApprovalWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApprovalWorkflowService]
    });
  });

  it('should ...', inject([ApprovalWorkflowService], (service: ApprovalWorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
