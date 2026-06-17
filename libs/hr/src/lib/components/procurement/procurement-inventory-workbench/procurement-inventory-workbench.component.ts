import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CreateInventoryItemDto,
  CreateProcurementRequestDto,
  InventoryItemDto,
  ModuleSummaryDto,
  ProcurementRequestDto,
} from '../../../dtos/operational-module.dto';
import { OperationalModulesService } from '../../../services/operational-modules.service';

@Component({
  selector: 'lib-procurement-inventory-workbench',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './procurement-inventory-workbench.component.html',
})
export class ProcurementInventoryWorkbenchComponent implements OnInit {
  summary?: ModuleSummaryDto;
  procurementRequests: ProcurementRequestDto[] = [];
  inventoryItems: InventoryItemDto[] = [];
  activeSection = 'requests';
  selectedInventoryItem?: InventoryItemDto;
  lowStockOnly = false;
  isLoading = true;
  isSavingRequest = false;
  isSavingInventory = false;
  errorMessage = '';
  successMessage = '';
  private readonly fb = inject(FormBuilder);

  requestForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    estimatedAmount: [0, [Validators.required, Validators.min(0)]],
    priority: ['Normal', Validators.required],
    neededBy: [''],
  });

  inventoryForm = this.fb.group({
    sku: ['', Validators.required],
    name: ['', Validators.required],
    category: ['', Validators.required],
    quantityOnHand: [0, [Validators.required, Validators.min(0)]],
    reorderLevel: [0, [Validators.required, Validators.min(0)]],
    unitCost: [0, [Validators.required, Validators.min(0)]],
    location: ['', Validators.required],
    status: ['Available', Validators.required],
  });

  constructor(
    private readonly modulesService: OperationalModulesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.activeSection = params.get('section') || 'requests';
    });
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.clearMessages();

    this.modulesService.getSummary().subscribe({
      next: (response) => {
        this.summary = response.data;
      },
      error: () => {
        this.errorMessage = 'Unable to load procurement summary.';
      },
    });

    this.modulesService.getProcurementRequests().subscribe({
      next: (response) => {
        this.procurementRequests = response.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load purchase requests.';
        this.isLoading = false;
      },
    });

    this.modulesService.getInventoryItems(this.lowStockOnly).subscribe({
      next: (response) => {
        this.inventoryItems = response.data ?? [];
      },
      error: () => {
        this.errorMessage = 'Unable to load inventory items.';
      },
    });
  }

  submitRequest() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isSavingRequest = true;
    this.clearMessages();
    const raw = this.requestForm.getRawValue();
    const payload: CreateProcurementRequestDto = {
      title: raw.title || '',
      description: raw.description || '',
      estimatedAmount: raw.estimatedAmount || 0,
      priority: raw.priority || 'Normal',
      neededBy: raw.neededBy || undefined,
    };

    this.modulesService.createProcurementRequest(payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Purchase request submitted.';
        this.requestForm.reset({
          title: '',
          description: '',
          estimatedAmount: 0,
          priority: 'Normal',
          neededBy: '',
        });
        this.loadData();
        this.isSavingRequest = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to submit purchase request.';
        this.isSavingRequest = false;
      },
    });
  }

  updateRequestStatus(request: ProcurementRequestDto, status: string) {
    this.clearMessages();
    this.modulesService.updateProcurementRequestStatus(request.id, { status }).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Purchase request updated.';
        this.loadData();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to update purchase request.';
      },
    });
  }

  saveInventoryItem() {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }

    this.isSavingInventory = true;
    this.clearMessages();
    const payload = this.inventoryForm.getRawValue() as CreateInventoryItemDto;
    const request = this.selectedInventoryItem
      ? this.modulesService.updateInventoryItem(this.selectedInventoryItem.id, payload)
      : this.modulesService.createInventoryItem(payload);

    request.subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Inventory item saved.';
        this.resetInventoryForm();
        this.loadData();
        this.isSavingInventory = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to save inventory item.';
        this.isSavingInventory = false;
      },
    });
  }

  editInventoryItem(item: InventoryItemDto) {
    this.selectedInventoryItem = item;
    this.inventoryForm.patchValue({
      sku: item.sku,
      name: item.name,
      category: item.category,
      quantityOnHand: item.quantityOnHand,
      reorderLevel: item.reorderLevel,
      unitCost: item.unitCost,
      location: item.location,
      status: item.status,
    });
  }

  resetInventoryForm() {
    this.selectedInventoryItem = undefined;
    this.inventoryForm.reset({
      sku: '',
      name: '',
      category: '',
      quantityOnHand: 0,
      reorderLevel: 0,
      unitCost: 0,
      location: '',
      status: 'Available',
    });
  }

  toggleLowStock() {
    this.lowStockOnly = !this.lowStockOnly;
    this.loadData();
  }

  get pendingRequests() {
    return this.procurementRequests.filter(
      (request) => !['Completed', 'Cancelled'].includes(request.status)
    ).length;
  }

  get lowStockCount() {
    return this.inventoryItems.filter(
      (item) => item.quantityOnHand <= item.reorderLevel
    ).length;
  }

  get inventoryValue() {
    return this.inventoryItems.reduce(
      (sum, item) => sum + (item.quantityOnHand || 0) * (item.unitCost || 0),
      0
    );
  }

  get showRequestsSection() {
    return ['requests', 'dashboard'].includes(this.activeSection);
  }

  get showInventorySection() {
    return ['inventory', 'dashboard'].includes(this.activeSection);
  }

  statusClass(status: string) {
    const normalized = status?.toLowerCase();
    if (['approved', 'completed', 'available'].includes(normalized)) {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (['rejected', 'cancelled', 'unavailable'].includes(normalized)) {
      return 'bg-rose-50 text-rose-700';
    }
    if (['in review', 'reserved'].includes(normalized)) {
      return 'bg-blue-50 text-blue-700';
    }
    return 'bg-amber-50 text-amber-700';
  }

  stockClass(item: InventoryItemDto) {
    return item.quantityOnHand <= item.reorderLevel
      ? 'bg-rose-50 text-rose-700'
      : 'bg-emerald-50 text-emerald-700';
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
