import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CreatePayrollRunDto,
  CreateSalaryStructureDto,
  ModuleSummaryDto,
  PayrollRunDto,
  SalaryStructureDto,
} from '../../../dtos/operational-module.dto';
import { OperationalModulesService } from '../../../services/operational-modules.service';

@Component({
  selector: 'lib-finance-payroll-workbench',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './finance-payroll-workbench.component.html',
})
export class FinancePayrollWorkbenchComponent implements OnInit {
  summary?: ModuleSummaryDto;
  salaryStructures: SalaryStructureDto[] = [];
  payrollRuns: PayrollRunDto[] = [];
  activeSection = 'dashboard';
  selectedSalaryStructure?: SalaryStructureDto;
  isLoading = true;
  isSavingSalary = false;
  isSavingPayroll = false;
  errorMessage = '';
  successMessage = '';
  private readonly fb = inject(FormBuilder);

  salaryForm = this.fb.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    gradeLevel: ['', Validators.required],
    basePay: [0, [Validators.required, Validators.min(0)]],
    housingAllowance: [0, [Validators.required, Validators.min(0)]],
    transportAllowance: [0, [Validators.required, Validators.min(0)]],
    otherAllowance: [0, [Validators.required, Validators.min(0)]],
    taxRatePercent: [0, [Validators.required, Validators.min(0)]],
    pensionRatePercent: [0, [Validators.required, Validators.min(0)]],
    isActive: [true],
  });

  payrollForm = this.fb.group({
    periodName: ['', Validators.required],
    periodStart: ['', Validators.required],
    periodEnd: ['', Validators.required],
    employeeCount: [0, [Validators.required, Validators.min(0)]],
    grossPayTotal: [0, [Validators.required, Validators.min(0)]],
    netPayTotal: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private readonly modulesService: OperationalModulesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.activeSection = params.get('section') || 'dashboard';
    });
    this.loadFinanceData();
  }

  loadFinanceData() {
    this.isLoading = true;
    this.errorMessage = '';

    this.modulesService.getSummary().subscribe({
      next: (response) => {
        this.summary = response.data;
      },
      error: () => {
        this.errorMessage = 'Unable to load finance summary.';
      },
    });

    this.modulesService.getSalaryStructures().subscribe({
      next: (response) => {
        this.salaryStructures = response.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load salary structures.';
        this.isLoading = false;
      },
    });

    this.modulesService.getPayrollRuns().subscribe({
      next: (response) => {
        this.payrollRuns = response.data ?? [];
      },
      error: () => {
        this.errorMessage = 'Unable to load payroll runs.';
      },
    });
  }

  saveSalaryStructure() {
    if (this.salaryForm.invalid) {
      this.salaryForm.markAllAsTouched();
      return;
    }

    this.isSavingSalary = true;
    this.clearMessages();
    const payload = this.salaryForm.getRawValue() as CreateSalaryStructureDto;
    const request = this.selectedSalaryStructure
      ? this.modulesService.updateSalaryStructure(this.selectedSalaryStructure.id, payload)
      : this.modulesService.createSalaryStructure(payload);

    request.subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Salary structure saved.';
        this.resetSalaryForm();
        this.loadFinanceData();
        this.isSavingSalary = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to save salary structure.';
        this.isSavingSalary = false;
      },
    });
  }

  editSalaryStructure(structure: SalaryStructureDto) {
    this.selectedSalaryStructure = structure;
    this.salaryForm.patchValue({
      code: structure.code,
      name: structure.name,
      gradeLevel: structure.gradeLevel,
      basePay: structure.basePay,
      housingAllowance: structure.housingAllowance,
      transportAllowance: structure.transportAllowance,
      otherAllowance: structure.otherAllowance,
      taxRatePercent: structure.taxRatePercent,
      pensionRatePercent: structure.pensionRatePercent,
      isActive: structure.isActive,
    });
  }

  resetSalaryForm() {
    this.selectedSalaryStructure = undefined;
    this.salaryForm.reset({
      code: '',
      name: '',
      gradeLevel: '',
      basePay: 0,
      housingAllowance: 0,
      transportAllowance: 0,
      otherAllowance: 0,
      taxRatePercent: 0,
      pensionRatePercent: 0,
      isActive: true,
    });
  }

  createPayrollRun() {
    if (this.payrollForm.invalid) {
      this.payrollForm.markAllAsTouched();
      return;
    }

    this.isSavingPayroll = true;
    this.clearMessages();
    const payload = this.payrollForm.getRawValue() as CreatePayrollRunDto;

    this.modulesService.createPayrollRun(payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Payroll run created.';
        this.payrollForm.reset({
          periodName: '',
          periodStart: '',
          periodEnd: '',
          employeeCount: 0,
          grossPayTotal: 0,
          netPayTotal: 0,
        });
        this.loadFinanceData();
        this.isSavingPayroll = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to create payroll run.';
        this.isSavingPayroll = false;
      },
    });
  }

  updatePayrollStatus(run: PayrollRunDto, status: string) {
    this.clearMessages();
    this.modulesService.updatePayrollRunStatus(run.id, { status }).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Payroll status updated.';
        this.loadFinanceData();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to update payroll status.';
      },
    });
  }

  get totalGrossPay() {
    return this.payrollRuns.reduce((sum, run) => sum + (run.grossPayTotal || 0), 0);
  }

  get totalNetPay() {
    return this.payrollRuns.reduce((sum, run) => sum + (run.netPayTotal || 0), 0);
  }

  get activeSalaryStructures() {
    return this.salaryStructures.filter((structure) => structure.isActive).length;
  }

  get showSalarySection() {
    return ['dashboard', 'salary-structure', 'salary'].includes(this.activeSection);
  }

  get showPayrollSection() {
    return ['dashboard', 'payslips', 'runs', 'bonuses'].includes(this.activeSection);
  }

  payrollStatusClass(status: string) {
    const normalized = status?.toLowerCase();
    if (normalized === 'processed') {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (normalized === 'approved') {
      return 'bg-blue-50 text-blue-700';
    }
    if (normalized === 'cancelled') {
      return 'bg-rose-50 text-rose-700';
    }
    return 'bg-amber-50 text-amber-700';
  }

  formatCurrency(value: number) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(value || 0);
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
