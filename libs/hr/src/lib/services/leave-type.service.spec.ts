/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeaveTypeService } from './leave-type.service';

describe('Service: LeaveType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeaveTypeService]
    });
  });

  it('should ...', inject([LeaveTypeService], (service: LeaveTypeService) => {
    expect(service).toBeTruthy();
  }));
});
