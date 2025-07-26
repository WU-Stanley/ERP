/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmploymentTypeService } from './employment-type.service';

describe('Service: EmploymentType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmploymentTypeService]
    });
  });

  it('should ...', inject([EmploymentTypeService], (service: EmploymentTypeService) => {
    expect(service).toBeTruthy();
  }));
});
