import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DepartmentDto } from '@erp/auth';
import { PublicRecruitmentStatsDto, PublicJobListingDto } from '../../../dtos/recruitment.dto';
import { RecruitmentService } from '../../../services/recruitment.service';

@Component({
  selector: 'app-public-teams',
  templateUrl: './public-teams.component.html',
  imports: [CommonModule, RouterModule],
})
export class PublicTeamsComponent implements OnInit {
  companyName = '';
  departments: DepartmentDto[] = [];
  departmentNames = new Set<string>();
  isLoading = true;
  errorMessage = '';
  stats: PublicRecruitmentStatsDto | null = null;

  constructor(private recruitmentService: RecruitmentService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.recruitmentService.getPublicStats().subscribe({
      next: (response) => {
        this.stats = response.data ?? null;
        this.companyName = this.stats?.companyName ?? 'Our Company';
        this.extractDepartmentsFromJobs(this.stats?.featuredJobs ?? []);
      },
      error: () => {
        this.companyName = 'Our Company';
        this.loadJobsForDepartments();
      },
    });
  }

  private extractDepartmentsFromJobs(jobs: PublicJobListingDto[]): void {
    jobs.forEach((job) => {
      if (job.departmentName) {
        this.departmentNames.add(job.departmentName);
      }
    });
    this.departments = Array.from(this.departmentNames).map((name) => ({
      id: name,
      name,
      isActive: true,
      description: '',
    }));
    this.isLoading = false;
  }

  private loadJobsForDepartments(): void {
    this.recruitmentService.getPublicJobPostings().subscribe({
      next: (response) => {
        this.extractDepartmentsFromJobs(response.data ?? []);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load team information.';
        this.isLoading = false;
      },
    });
  }
}