import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Params } from '@angular/router';
import { RecruitmentService } from '../../../services/recruitment.service';
import { RecruitmentStatsDto } from '../../../dtos/recruitment.dto';

interface MetricCard {
  label: string;
  value: number;
  icon: string;
  tone: string;
  route: string;
  queryParams?: Params;
}

@Component({
  selector: 'app-recruitment-dashboard',
  templateUrl: './recruitment-dashboard.component.html',
  styleUrls: ['./recruitment-dashboard.component.css'],
  imports: [CommonModule, RouterModule],
})
export class RecruitmentDashboardComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  stats: RecruitmentStatsDto | null = null;

  get metricCards(): MetricCard[] {
    if (!this.stats) return [];
    return [
      { label: 'Open Positions', value: this.stats.activeJobPostings, icon: 'work', tone: 'bg-wigwe-green', route: '/hr/recruitment/job-postings' },
      { label: 'Total Applications', value: this.stats.totalApplications, icon: 'assignment', tone: 'bg-indigo-600', route: '/hr/recruitment/applications' },
      { label: 'Interviewing', value: this.stats.shortlistedCount + this.stats.interviewCount, icon: 'videocam', tone: 'bg-amber-500', route: '/hr/recruitment/applications', queryParams: { statusFilter: 'Interviewing' } },
      { label: 'Offers Sent', value: this.stats.offerCount, icon: 'send', tone: 'bg-emerald-600', route: '/hr/recruitment/applications', queryParams: { statusFilter: 'Offer' } },
      { label: 'Hired', value: this.stats.hiredCount, icon: 'check_circle', tone: 'bg-teal-600', route: '/hr/recruitment/applications' },
      { label: 'Rejected', value: this.stats.rejectedCount, icon: 'cancel', tone: 'bg-rose-600', route: '/hr/recruitment/applications' },
    ];
  }

  get avgMatchScore() {
    return this.stats?.averageMatchScore ?? 0;
  }

  constructor(private recruitmentService: RecruitmentService) {}

  getPercentage(value: number): number {
    if (!this.stats || this.stats.totalApplications === 0) return 0;
    return Math.round((value / this.stats.totalApplications) * 100);
  }

  ngOnInit() {
    this.recruitmentService.getStats().subscribe({
      next: (response) => {
        this.stats = response.data ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load recruitment dashboard metrics.';
        this.isLoading = false;
      },
    });
  }
}
