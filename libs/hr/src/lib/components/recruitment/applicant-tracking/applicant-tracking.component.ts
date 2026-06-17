import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApplicantTrackingDto, OfferResponseDto } from '../../../dtos/recruitment.dto';
import { RecruitmentService } from '../../../services/recruitment.service';

@Component({
  selector: 'app-applicant-tracking',
  templateUrl: './applicant-tracking.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ApplicantTrackingComponent implements OnInit {
  applicationId = '';
  email = '';
  tracking: ApplicantTrackingDto | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recruitmentService: RecruitmentService
  ) {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.queryParamMap.get('applicationId') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    if (this.applicationId && this.email) {
      this.trackApplication();
    }
  }

  trackApplication(): void {
    if (!this.applicationId || !this.email) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.tracking = null;

    this.recruitmentService.trackApplication(this.applicationId.trim(), this.email.trim()).subscribe({
      next: (response) => {
        this.tracking = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'No application found for this reference and email.';
        this.isLoading = false;
      },
    });
  }

  respondToOffer(response: 'Accept' | 'Decline'): void {
    if (!this.tracking?.offerLetter) return;
    const dto: OfferResponseDto = { response };

    this.recruitmentService.respondToOffer(this.tracking.offerLetter.id, dto).subscribe({
      next: () => {
        this.successMessage = `Offer ${response.toLowerCase()}ed successfully.`;
        this.trackApplication();
      },
      error: () => {
        this.errorMessage = 'Unable to update your offer response.';
      },
    });
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  statusClass(status: string): string {
    const normalized = status.toLowerCase();
    if (['hired', 'accepted', 'offer'].includes(normalized)) return 'bg-green-100 text-green-700';
    if (['rejected', 'declined', 'cancelled', 'expired'].includes(normalized)) return 'bg-red-100 text-red-700';
    if (['interviewing', 'scheduled', 'shortlisted'].includes(normalized)) return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-700';
  }
}
