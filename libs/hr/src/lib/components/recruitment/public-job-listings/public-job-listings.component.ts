import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecruitmentService } from '../../../services/recruitment.service';
import { PublicJobListingDto, PublicRecruitmentStatsDto } from '../../../dtos/recruitment.dto';

@Component({
  selector: 'app-public-job-listings',
  templateUrl: './public-job-listings.component.html',
  imports: [CommonModule, RouterModule, FormsModule],
})
export class PublicJobListingsComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  companyName = '';
  jobs: PublicJobListingDto[] = [];
  stats: PublicRecruitmentStatsDto | null = null;
  searchQuery = '';
  filteredJobs: PublicJobListingDto[] = [];

  constructor(private recruitmentService: RecruitmentService) {}

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredJobs = [...this.jobs];
  }
  ngOnInit() {
    this.recruitmentService.getPublicStats().subscribe({
      next: (response) => {
        this.stats = response.data ?? null;
        this.companyName = this.stats?.companyName ?? 'Wigwe University';
        this.jobs = this.stats?.featuredJobs ?? [];
        this.filteredJobs = [...this.jobs];
        if (this.jobs.length > 0) {
          this.isLoading = false;
        } else {
          this.loadPublicJobs();
        }
      },
      error: () => {
        this.loadPublicJobs();
      },
    });
  }

  loadPublicJobs() {
    this.recruitmentService.getPublicJobPostings().subscribe({
      next: (response) => {
        this.jobs = response.data ?? [];
        this.filteredJobs = [...this.jobs];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load job listings.';
        this.isLoading = false;
      },
    });
  }

  searchJobs() {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredJobs = [...this.jobs];
      return;
    }
    this.filteredJobs = this.jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        (j.departmentName?.toLowerCase().includes(q) ?? false) ||
        (j.location?.toLowerCase().includes(q) ?? false)
    );
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  isExpired(date: Date): boolean {
    return new Date(date) < new Date();
  }

  daysRemaining(date: Date): number {
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
