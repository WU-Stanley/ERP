import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CreateDocumentRecordDto,
  DocumentRecordDto,
  ModuleSummaryDto,
} from '../../../dtos/operational-module.dto';
import { OperationalModulesService } from '../../../services/operational-modules.service';

@Component({
  selector: 'lib-document-management-workbench',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './document-management-workbench.component.html',
})
export class DocumentManagementWorkbenchComponent implements OnInit {
  summary?: ModuleSummaryDto;
  documents: DocumentRecordDto[] = [];
  activeSection = 'upload';
  categoryFilter = '';
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  private readonly fb = inject(FormBuilder);

  documentForm = this.fb.group({
    title: ['', Validators.required],
    category: ['HR', Validators.required],
    storageUrl: ['', Validators.required],
    confidentiality: ['Internal', Validators.required],
    status: ['Draft', Validators.required],
  });

  constructor(
    private readonly modulesService: OperationalModulesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.activeSection = params.get('section') || 'upload';
    });
    this.loadDocuments();
  }

  loadDocuments() {
    this.isLoading = true;
    this.clearMessages();

    this.modulesService.getSummary().subscribe({
      next: (response) => {
        this.summary = response.data;
      },
      error: () => {
        this.errorMessage = 'Unable to load document summary.';
      },
    });

    this.modulesService.getDocuments(this.categoryFilter || undefined).subscribe({
      next: (response) => {
        this.documents = response.data ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load documents.';
        this.isLoading = false;
      },
    });
  }

  registerDocument() {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.clearMessages();
    const payload = this.documentForm.getRawValue() as CreateDocumentRecordDto;

    this.modulesService.createDocument(payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Document registered.';
        this.documentForm.reset({
          title: '',
          category: 'HR',
          storageUrl: '',
          confidentiality: 'Internal',
          status: 'Draft',
        });
        this.loadDocuments();
        this.isSaving = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to register document.';
        this.isSaving = false;
      },
    });
  }

  updateDocumentStatus(document: DocumentRecordDto, status: string) {
    this.clearMessages();
    this.modulesService.updateDocumentStatus(document.id, { status }).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Document status updated.';
        this.loadDocuments();
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to update document.';
      },
    });
  }

  get pendingDocuments() {
    return this.documents.filter((document) => ['Draft', 'Pending Review'].includes(document.status)).length;
  }

  get archivedDocuments() {
    return this.documents.filter((document) => document.status === 'Archived').length;
  }

  get visibleDocuments() {
    if (this.activeSection === 'approve') {
      return this.documents.filter((document) => ['Draft', 'Pending Review'].includes(document.status));
    }
    if (this.activeSection === 'archive') {
      return this.documents.filter((document) => document.status === 'Archived');
    }
    if (this.activeSection === 'delete') {
      return this.documents.filter((document) => document.status !== 'Deleted');
    }
    return this.documents;
  }

  statusClass(status: string) {
    const normalized = status?.toLowerCase();
    if (['published', 'approved'].includes(normalized)) {
      return 'bg-emerald-50 text-emerald-700';
    }
    if (['archived'].includes(normalized)) {
      return 'bg-slate-100 text-slate-600';
    }
    if (['deleted', 'rejected'].includes(normalized)) {
      return 'bg-rose-50 text-rose-700';
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
