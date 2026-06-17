import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  CreateRegistryIntegrationDto,
  ModuleSummaryDto,
  RegistryIntegrationRecordDto,
} from '../../../dtos/operational-module.dto';
import { OperationalModulesService } from '../../../services/operational-modules.service';

@Component({
  selector: 'lib-registry-integration-workbench',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registry-integration-workbench.component.html',
})
export class RegistryIntegrationWorkbenchComponent implements OnInit {
  readonly wuPortalUrl = 'https://portal.wigweuniversity.edu.ng/wuportal';
  summary?: ModuleSummaryDto;
  integrations: RegistryIntegrationRecordDto[] = [];
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  private readonly fb = inject(FormBuilder);

  integrationForm = this.fb.group({
    systemName: ['WU Portal / LMS', Validators.required],
    integrationType: ['External Link', Validators.required],
    externalUrl: [this.wuPortalUrl, Validators.required],
    status: ['Linked', Validators.required],
    lastSyncedAt: [''],
    notes: ['Portal and LMS are deployed externally and linked from ERP apps.'],
  });

  constructor(private readonly modulesService: OperationalModulesService) {}

  ngOnInit() {
    this.loadIntegrations();
  }

  loadIntegrations() {
    this.isLoading = true;
    this.clearMessages();

    this.modulesService.getSummary().subscribe({
      next: (response) => {
        this.summary = response.data;
      },
      error: () => {
        this.errorMessage = 'Unable to load registry summary.';
      },
    });

    this.modulesService.getRegistryIntegrations().subscribe({
      next: (response) => {
        this.integrations = response.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load registry integrations.';
        this.isLoading = false;
      },
    });
  }

  createIntegration() {
    if (this.integrationForm.invalid) {
      this.integrationForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.clearMessages();
    const raw = this.integrationForm.getRawValue();
    const payload: CreateRegistryIntegrationDto = {
      systemName: raw.systemName || '',
      integrationType: raw.integrationType || '',
      externalUrl: raw.externalUrl || '',
      status: raw.status || 'Planned',
      lastSyncedAt: raw.lastSyncedAt || undefined,
      notes: raw.notes || '',
    };

    this.modulesService.createRegistryIntegration(payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Registry integration created.';
        this.integrationForm.reset({
          systemName: 'WU Portal / LMS',
          integrationType: 'External Link',
          externalUrl: this.wuPortalUrl,
          status: 'Linked',
          lastSyncedAt: '',
          notes: 'Portal and LMS are deployed externally and linked from ERP apps.',
        });
        this.loadIntegrations();
        this.isSaving = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to create registry integration.';
        this.isSaving = false;
      },
    });
  }

  updateStatus(integration: RegistryIntegrationRecordDto, status: string) {
    this.clearMessages();
    this.modulesService.updateRegistryIntegrationStatus(integration.id, { status }).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Integration status updated.';
        this.loadIntegrations();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to update integration status.';
      },
    });
  }

  get linkedIntegrations() {
    return this.integrations.filter((integration) =>
      ['Linked', 'Synced', 'Active'].includes(integration.status)
    ).length;
  }

  get attentionIntegrations() {
    return this.integrations.filter((integration) =>
      ['Failed', 'Paused', 'Disconnected'].includes(integration.status)
    ).length;
  }

  statusClass(status: string) {
    const normalized = status?.toLowerCase();
    if (['linked', 'synced', 'active'].includes(normalized)) {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (['failed', 'paused', 'disconnected'].includes(normalized)) {
      return 'bg-rose-50 text-rose-700';
    }
    if (normalized === 'testing') {
      return 'bg-blue-50 text-blue-700';
    }
    return 'bg-amber-50 text-amber-700';
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
