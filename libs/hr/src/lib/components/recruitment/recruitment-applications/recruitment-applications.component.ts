import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecruitmentService } from '../../../services/recruitment.service';
import { ApplicationDto, ApplicationListDto } from '../../../dtos/recruitment.dto';

const STATUS_TABS = ['All', 'New', 'Shortlisted', 'Interviewing', 'Offer', 'Hired', 'Rejected'];

@Component({
  selector: 'app-recruitment-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './recruitment-applications.component.html',
})
export class RecruitmentApplicationsComponent implements OnInit {
  private readonly recruitmentService = inject(RecruitmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  applications: ApplicationDto[] = [];
  totalCount = 0;
  pageNumber = 1;
  pageSize = 20;
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  activeTab = 'All';
  searchQuery = '';
  statusTabs = STATUS_TABS;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['statusFilter']) {
        this.activeTab = params['statusFilter'];
      }
      this.loadApplications();
    });
  }

  loadApplications() {
    this.isLoading = true;
    this.errorMessage = '';
    const filter = this.activeTab === 'All' ? undefined : this.activeTab;
    this.recruitmentService
      .getApplications(this.pageNumber, this.pageSize, filter, this.searchQuery || undefined)
      .subscribe({
        next: (res) => {
          const data: ApplicationListDto = res.data;
          this.applications = data.applications;
          this.totalCount = data.totalCount;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Unable to load applications.';
          this.isLoading = false;
        },
      });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.pageNumber = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { statusFilter: tab === 'All' ? null : tab },
      queryParamsHandling: 'merge',
    });
    this.loadApplications();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadApplications();
  }

  clearSearch() {
    this.searchQuery = '';
    this.pageNumber = 1;
    this.loadApplications();
  }

  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalCount) {
      this.pageNumber++;
      this.loadApplications();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadApplications();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  viewApplication(id: string) {
    this.router.navigate(['/hr/recruitment/applications', id]);
  }

  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      New: 'bg-blue-100 text-blue-700',
      Shortlisted: 'bg-indigo-100 text-indigo-700',
      Interviewing: 'bg-amber-100 text-amber-700',
      Offer: 'bg-emerald-100 text-emerald-700',
      Hired: 'bg-teal-100 text-teal-700',
      Rejected: 'bg-rose-100 text-rose-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  getMatchColor(score: number | null): string {
    if (score === null) return 'text-gray-400';
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  }
}
