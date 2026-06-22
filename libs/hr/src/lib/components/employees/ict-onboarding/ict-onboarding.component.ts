import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RecruitmentService } from '../../../services/recruitment.service';
import { IctOnboardingDto, MicrosoftAccountProvisioningDto } from '../../../dtos/recruitment.dto';

@Component({
  selector: 'app-ict-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ict-onboarding.component.html',
})
export class IctOnboardingComponent implements OnInit {
  private readonly recruitmentService = inject(RecruitmentService);

  requests: IctOnboardingDto[] = [];
  provisioningId = '';
  errorMessage = '';
  credentials: MicrosoftAccountProvisioningDto | null = null;

  ngOnInit(): void {
    this.loadQueue();
  }

  loadQueue(): void {
    this.errorMessage = '';
    this.recruitmentService.getIctOnboardingQueue().subscribe({
      next: (response) => (this.requests = response.data ?? []),
      error: (error) => (this.errorMessage = error?.error?.message || 'Unable to load the ICT onboarding queue.'),
    });
  }

  provision(request: IctOnboardingDto): void {
    if (!confirm(`Create a Microsoft account for ${request.employeeName}?`)) return;
    this.provisioningId = request.applicationId;
    this.errorMessage = '';
    this.recruitmentService.provisionMicrosoftAccount(request.applicationId).subscribe({
      next: (response) => {
        this.credentials = response.data;
        this.provisioningId = '';
        this.loadQueue();
      },
      error: (error) => {
        this.provisioningId = '';
        this.errorMessage = error?.error?.message || 'Microsoft account provisioning failed.';
        this.loadQueue();
      },
    });
  }

  async copy(value: string | null): Promise<void> {
    if (value) await navigator.clipboard.writeText(value);
  }

  closeCredentials(): void {
    this.credentials = null;
  }
}
