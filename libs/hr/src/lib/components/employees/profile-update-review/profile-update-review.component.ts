import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeProfileUpdateRequestDto } from '../../../dtos/employee.dto';
import { EmployeeService } from '../../../services/employee.service';

@Component({
  selector: 'lib-profile-update-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-update-review.component.html',
})
export class ProfileUpdateReviewComponent implements OnInit {
  requests: EmployeeProfileUpdateRequestDto[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  comments: Record<string, string> = {};
  activeRequestId = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getProfileUpdateRequests('Pending').subscribe({
      next: (response) => {
        this.requests = response.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load profile update requests.';
        this.isLoading = false;
      },
    });
  }

  decide(request: EmployeeProfileUpdateRequestDto, isApproved: boolean) {
    this.activeRequestId = request.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.employeeService
      .reviewProfileUpdateRequest(request.id, {
        isApproved,
        comment: this.comments[request.id] || null,
      })
      .subscribe({
        next: () => {
          this.requests = this.requests.filter((item) => item.id !== request.id);
          this.successMessage = `Request ${isApproved ? 'approved' : 'rejected'} successfully.`;
          this.activeRequestId = '';
        },
        error: () => {
          this.errorMessage = 'Unable to process this request.';
          this.activeRequestId = '';
        },
      });
  }

  fieldsFor(request: EmployeeProfileUpdateRequestDto) {
    return [
      { label: 'Phone', current: request.currentValues.phoneNumber, proposed: request.proposedValues.phoneNumber },
      { label: 'Address', current: request.currentValues.address, proposed: request.proposedValues.address },
      { label: 'Next of Kin', current: request.currentValues.emergencyContactName, proposed: request.proposedValues.emergencyContactName },
      { label: 'Next of Kin Phone', current: request.currentValues.emergencyContactPhone, proposed: request.proposedValues.emergencyContactPhone },
      { label: 'Relationship', current: request.currentValues.relationship, proposed: request.proposedValues.relationship },
      { label: 'Bank', current: request.currentValues.bankName, proposed: request.proposedValues.bankName },
      { label: 'Account Number', current: request.currentValues.bankAccountNumber, proposed: request.proposedValues.bankAccountNumber },
    ];
  }
}
