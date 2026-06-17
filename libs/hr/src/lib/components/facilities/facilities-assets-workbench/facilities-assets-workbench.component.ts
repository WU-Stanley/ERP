import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CreateFacilityAssetDto,
  FacilityAssetDto,
  ModuleSummaryDto,
} from '../../../dtos/operational-module.dto';
import { OperationalModulesService } from '../../../services/operational-modules.service';

@Component({
  selector: 'lib-facilities-assets-workbench',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './facilities-assets-workbench.component.html',
})
export class FacilitiesAssetsWorkbenchComponent implements OnInit {
  summary?: ModuleSummaryDto;
  assets: FacilityAssetDto[] = [];
  activeSection = 'assets';
  selectedAsset?: FacilityAssetDto;
  statusFilter = '';
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  private readonly fb = inject(FormBuilder);

  assetForm = this.fb.group({
    assetTag: ['', Validators.required],
    name: ['', Validators.required],
    category: ['', Validators.required],
    location: ['', Validators.required],
    condition: ['Good', Validators.required],
    status: ['InUse', Validators.required],
    purchaseDate: [''],
    purchaseCost: [0, [Validators.required, Validators.min(0)]],
    warrantyExpiryDate: [''],
  });

  constructor(
    private readonly modulesService: OperationalModulesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.activeSection = params.get('section') || 'assets';
    });
    this.loadAssets();
  }

  loadAssets() {
    this.isLoading = true;
    this.clearMessages();

    this.modulesService.getSummary().subscribe({
      next: (response) => {
        this.summary = response.data;
      },
      error: () => {
        this.errorMessage = 'Unable to load facilities summary.';
      },
    });

    this.modulesService.getFacilityAssets(this.statusFilter || undefined).subscribe({
      next: (response) => {
        this.assets = response.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load facility assets.';
        this.isLoading = false;
      },
    });
  }

  saveAsset() {
    if (this.assetForm.invalid) {
      this.assetForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.clearMessages();
    const raw = this.assetForm.getRawValue();
    const payload: CreateFacilityAssetDto = {
      assetTag: raw.assetTag || '',
      name: raw.name || '',
      category: raw.category || '',
      location: raw.location || '',
      condition: raw.condition || 'Good',
      status: raw.status || 'InUse',
      purchaseDate: raw.purchaseDate || undefined,
      purchaseCost: raw.purchaseCost || 0,
      warrantyExpiryDate: raw.warrantyExpiryDate || undefined,
    };
    const request = this.selectedAsset
      ? this.modulesService.updateFacilityAsset(this.selectedAsset.id, payload)
      : this.modulesService.createFacilityAsset(payload);

    request.subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Facility asset saved.';
        this.resetAssetForm();
        this.loadAssets();
        this.isSaving = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to save facility asset.';
        this.isSaving = false;
      },
    });
  }

  editAsset(asset: FacilityAssetDto) {
    this.selectedAsset = asset;
    this.assetForm.patchValue({
      assetTag: asset.assetTag,
      name: asset.name,
      category: asset.category,
      location: asset.location,
      condition: asset.condition,
      status: asset.status,
      purchaseDate: this.toDateInput(asset.purchaseDate),
      purchaseCost: asset.purchaseCost,
      warrantyExpiryDate: this.toDateInput(asset.warrantyExpiryDate),
    });
  }

  resetAssetForm() {
    this.selectedAsset = undefined;
    this.assetForm.reset({
      assetTag: '',
      name: '',
      category: '',
      location: '',
      condition: 'Good',
      status: 'InUse',
      purchaseDate: '',
      purchaseCost: 0,
      warrantyExpiryDate: '',
    });
  }

  get totalAssetValue() {
    return this.assets.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0);
  }

  get activeAssets() {
    return this.assets.filter((asset) => asset.status === 'InUse').length;
  }

  get needsAttention() {
    return this.assets.filter((asset) =>
      ['Poor', 'Damaged', 'UnderRepair'].includes(asset.condition) ||
      ['UnderMaintenance', 'Retired'].includes(asset.status)
    ).length;
  }

  statusClass(status: string) {
    const normalized = status?.toLowerCase();
    if (normalized === 'inuse' || normalized === 'available') {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (normalized === 'retired' || normalized === 'lost') {
      return 'bg-rose-50 text-rose-700';
    }
    if (normalized === 'undermaintenance') {
      return 'bg-blue-50 text-blue-700';
    }
    return 'bg-amber-50 text-amber-700';
  }

  conditionClass(condition: string) {
    const normalized = condition?.toLowerCase();
    if (normalized === 'good' || normalized === 'new') {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (normalized === 'poor' || normalized === 'damaged') {
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

  private toDateInput(value?: string) {
    return value ? value.slice(0, 10) : '';
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
