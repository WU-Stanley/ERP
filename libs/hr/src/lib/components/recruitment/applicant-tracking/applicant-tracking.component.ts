import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApplicantTrackingDto, OfferResponseDto } from '../../../dtos/recruitment.dto';
import { RecruitmentService } from '../../../services/recruitment.service';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-applicant-tracking',
  templateUrl: './applicant-tracking.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ApplicantTrackingComponent implements OnInit, AfterViewInit {
  applicationId = '';
  email = '';
  tracking: ApplicantTrackingDto | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  showAcceptModal = false;
  showDeclineModal = false;
  showNegotiateModal = false;
  acceptSignatureName = '';
  declineReason = '';
  negotiateText = '';
  pendingResponse: 'Accept' | 'Decline' | null = null;

  @ViewChild('signaturePad') signaturePadElement!: ElementRef<HTMLCanvasElement>;
  private signaturePad: SignaturePad | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recruitmentService: RecruitmentService
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.applicationId = this.route.snapshot.queryParamMap.get('applicationId') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    if (this.applicationId && this.email) {
      this.trackApplication();
    }
  }

  ngOnDestroy(): void {
    this.destroySignaturePad();
  }

  private destroySignaturePad(): void {
    if (this.signaturePad) {
      this.signaturePad.off();
      this.signaturePad = null;
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

  openAcceptModal(): void {
    if (!this.tracking?.offerLetter) return;
    this.pendingResponse = 'Accept';
    this.acceptSignatureName = this.tracking.offerLetter.applicantName || this.tracking.application.applicantName;
    this.showAcceptModal = true;
    this.showDeclineModal = false;
    this.showNegotiateModal = false;
    this.initSignaturePad();
  }

  closeAcceptModal(): void {
    this.showAcceptModal = false;
    this.destroySignaturePad();
  }

  openDeclineModal(): void {
    this.pendingResponse = 'Decline';
    this.declineReason = '';
    this.showDeclineModal = true;
    this.showAcceptModal = false;
    this.showNegotiateModal = false;
  }

  closeDeclineModal(): void {
    this.showDeclineModal = false;
  }

  openNegotiateModal(): void {
    this.negotiateText = '';
    this.showNegotiateModal = true;
    this.showAcceptModal = false;
    this.showDeclineModal = false;
  }

  closeNegotiateModal(): void {
    this.showNegotiateModal = false;
  }

  private initSignaturePad(): void {
    this.destroySignaturePad();
    setTimeout(() => {
      if (this.signaturePadElement) {
        const canvas = this.signaturePadElement.nativeElement;
        this.signaturePad = new SignaturePad(canvas, {
          backgroundColor: 'rgb(255, 255, 255)',
          penColor: 'rgb(0, 0, 0)',
        });
      }
    }, 100);
  }

  clearSignature(): void {
    if (this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  confirmAccept(): void {
    if (!this.tracking?.offerLetter) return;
    const signedName = this.acceptSignatureName.trim() || this.tracking.application.applicantName;
    let signatureData: string | undefined;
    if (this.signaturePad && !this.signaturePad.isEmpty()) {
      signatureData = this.signaturePad.toDataURL('image/png');
    }

    const dto: OfferResponseDto = {
      response: 'Accept',
      signedName,
      signatureData,
    };

    this.recruitmentService.respondToOffer(this.tracking.offerLetter.id, dto).subscribe({
      next: () => {
        this.successMessage = 'Offer accepted successfully.';
        this.showAcceptModal = false;
        this.destroySignaturePad();
        this.trackApplication();
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: () => {
        this.errorMessage = 'Unable to accept the offer.';
      },
    });
  }

  confirmDecline(): void {
    if (!this.tracking?.offerLetter) return;
    const dto: OfferResponseDto = {
      response: 'Decline',
      comments: this.declineReason.trim() || undefined,
    };

    this.recruitmentService.respondToOffer(this.tracking.offerLetter.id, dto).subscribe({
      next: () => {
        this.successMessage = 'Offer declined.';
        this.showDeclineModal = false;
        this.trackApplication();
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: () => {
        this.errorMessage = 'Unable to decline the offer.';
      },
    });
  }

  confirmNegotiate(): void {
    if (!this.tracking || !this.negotiateText.trim()) return;
    this.recruitmentService.createQuery(this.tracking.application.id, { message: this.negotiateText.trim() }).subscribe({
      next: () => {
        this.successMessage = 'Request sent to HR.';
        this.showNegotiateModal = false;
        this.negotiateText = '';
        this.trackApplication();
        setTimeout(() => (this.successMessage = ''), 4000);
      },
      error: () => {
        this.errorMessage = 'Unable to send request.';
      },
    });
  }

  printOffer(): void {
    if (!this.tracking?.offerLetter) return;
    const offer = this.tracking.offerLetter;
    const app = this.tracking.application;
    const printContent = `
      <html>
      <head><title>Offer Letter</title></head>
      <body style="font-family: sans-serif; max-width: 700px; margin: 0 auto; padding: 40px; color: #111;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 22px; margin: 0;">${offer.companyName}</h1>
          <p style="font-size: 13px; color: #666; margin-top: 4px;">Offer of Employment</p>
        </div>
        <p>Dear ${offer.applicantName},</p>
        <div style="margin: 16px 0;">${offer.content}</div>
        <div style="margin-top: 48px; border-top: 1px solid #ddd; padding-top: 16px;">
          <p style="font-weight: 600;">Signed:</p>
          <p style="margin-top: 4px;">${offer.signedName || app.applicantName}</p>
          ${offer.signatureData ? `<img src="${offer.signatureData}" style="max-height: 80px; margin-top: 8px; border: 1px solid #eee;" />` : ''}
          <p style="margin-top: 16px; font-size: 12px; color: #888;">Date: ${offer.signedAt ? new Date(offer.signedAt).toLocaleDateString('en-NG') : ''}</p>
        </div>
      </body>
      </html>
    `;
    const win = window.open('', '_blank', 'width=800,height=600');
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
        win.close();
      }, 250);
    }
  }

  getExpiryInfo(): { text: string; urgent: boolean } | null {
    if (!this.tracking?.offerLetter?.expiresAt) return null;
    const diff = new Date(this.tracking.offerLetter.expiresAt).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Expired', urgent: true };
    if (days <= 7) return { text: `Expires in ${days} day${days > 1 ? 's' : ''}`, urgent: true };
    return { text: `Expires in ${days} days`, urgent: false };
  }

  get expiryInfo(): { text: string; urgent: boolean } | null {
    return this.getExpiryInfo();
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
