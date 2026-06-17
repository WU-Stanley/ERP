import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CreateHelpdeskCommentDto,
  CreateHelpdeskTicketDto,
  HelpdeskTicketCommentDto,
  HelpdeskTicketDetailDto,
  HelpdeskTicketDto,
  ModuleSummaryDto,
} from '../../../dtos/operational-module.dto';
import { OperationalModulesService } from '../../../services/operational-modules.service';

type TicketTab = 'all' | 'mine' | 'new';

@Component({
  selector: 'lib-helpdesk-workbench',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './helpdesk-workbench.component.html',
  styleUrls: ['./helpdesk-workbench.component.css'],
})
export class HelpdeskWorkbenchComponent implements OnInit {
  summary?: ModuleSummaryDto;
  tickets: HelpdeskTicketDto[] = [];
  activeSection = 'tickets';
  activeAction = '';
  statusFilter = '';
  isLoading = true;
  isSaving = false;
  isCommenting = false;
  errorMessage = '';
  successMessage = '';

  activeTab: TicketTab = 'all';
  selectedTicket?: HelpdeskTicketDetailDto;
  selectedTicketId: string | null = null;
  commentText = '';

  private readonly fb = inject(FormBuilder);

  ticketForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['General', Validators.required],
    priority: ['Normal', Validators.required],
    dueAt: [''],
  });

  constructor(
    private readonly modulesService: OperationalModulesService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.activeSection = params.get('section') || 'tickets';
      this.activeAction = params.get('action') || '';

      if (this.activeSection === 'submit' || this.activeAction === 'new') {
        this.activeTab = 'new';
      }
    });

    this.loadTickets();
  }

  setActiveTab(tab: TicketTab) {
    this.activeTab = tab;
    this.selectedTicket = undefined;
    this.selectedTicketId = null;
    this.commentText = '';
    this.statusFilter = '';
    this.clearMessages();
    this.loadTickets();
  }

  isNotNewTicketTab() {
    return this.activeTab !== 'new';
  }

  loadTickets() {
    this.isLoading = true;
    this.clearMessages();

    this.modulesService.getSummary().subscribe({
      next: (response) => {
        this.summary = response.data;
      },
      error: () => {
        this.errorMessage = 'Unable to load helpdesk summary.';
      },
    });

    this.modulesService.getHelpdeskTickets(this.statusFilter || undefined).subscribe({
      next: (response) => {
        const tickets = response.data ?? [];
        if (this.activeTab === 'mine') {
          this.tickets = tickets.filter((ticket) => this.isCurrentUser(ticket.requesterUserId));
        } else {
          this.tickets = tickets;
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load helpdesk tickets.';
        this.isLoading = false;
      },
    });
  }

  openTicketDetail(ticketId: string) {
    this.isLoading = true;
    this.clearMessages();
    this.selectedTicketId = ticketId;

    this.modulesService.getHelpdeskTicketDetail(ticketId).subscribe({
      next: (response) => {
        this.selectedTicket = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load ticket details.';
        this.isLoading = false;
      },
    });
  }

  closeDetail() {
    this.selectedTicket = undefined;
    this.selectedTicketId = null;
    this.commentText = '';
  }

  submitTicket() {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.clearMessages();
    const raw = this.ticketForm.getRawValue();
    const payload: CreateHelpdeskTicketDto = {
      title: raw.title || '',
      description: raw.description || '',
      category: raw.category || 'General',
      priority: raw.priority || 'Normal',
      dueAt: raw.dueAt || undefined,
    };

    this.modulesService.createHelpdeskTicket(payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Ticket submitted.';
        this.ticketForm.reset({
          title: '',
          description: '',
          category: 'General',
          priority: 'Normal',
          dueAt: '',
        });
        this.activeTab = 'all';
        this.loadTickets();
        this.isSaving = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to submit ticket.';
        this.isSaving = false;
      },
    });
  }

  updateTicketStatus(ticketId: string, status: string) {
    this.isSaving = true;
    this.clearMessages();

    this.modulesService.updateHelpdeskTicketStatus(ticketId, { status }).subscribe({
      next: () => {
        this.successMessage = 'Ticket status updated.';
        this.isSaving = false;
        this.loadTickets();
        if (this.selectedTicketId) {
          this.openTicketDetail(this.selectedTicketId);
        }
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to update ticket.';
        this.isSaving = false;
      },
    });
  }

  addComment() {
    if (!this.selectedTicketId || !this.commentText.trim()) {
      return;
    }

    this.isCommenting = true;
    const payload: CreateHelpdeskCommentDto = {
      comment: this.commentText.trim(),
      isInternal: false,
    };

    this.modulesService.addHelpdeskTicketComment(this.selectedTicketId, payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Comment added.';
        this.commentText = '';
        this.isCommenting = false;
        if (this.selectedTicketId) {
          this.openTicketDetail(this.selectedTicketId);
        }
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to add comment.';
        this.isCommenting = false;
      },
    });
  }

  getTicketPriorityClass(priority: string) {
    const normalized = (priority || '').toLowerCase();
    if (normalized === 'urgent' || normalized === 'high') {
      return 'bg-rose-50 text-rose-700 ring-rose-100';
    }
    if (normalized === 'low') {
      return 'bg-slate-100 text-slate-600 ring-slate-200';
    }
    return 'bg-amber-50 text-amber-700 ring-amber-100';
  }

  getTicketStatusClass(status: string) {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'closed' || normalized === 'resolved') {
      return 'bg-emerald-50 text-emerald-700 ring-emerald-100';
    }
    if (normalized === 'cancelled') {
      return 'bg-rose-50 text-rose-700 ring-rose-100';
    }
    if (normalized === 'assigned' || normalized === 'in progress') {
      return 'bg-blue-50 text-blue-700 ring-blue-100';
    }
    return 'bg-amber-50 text-amber-700 ring-amber-100';
  }

  get openTickets() {
    return this.tickets.filter((ticket) => !['Closed', 'Cancelled'].includes(ticket.status)).length;
  }

  get urgentTickets() {
    return this.tickets.filter((ticket) => ticket.priority === 'Urgent' || ticket.priority === 'High').length;
  }

  get closedTickets() {
    return this.tickets.filter((ticket) => ticket.status === 'Closed').length;
  }

  get showSubmitForm() {
    return this.activeTab === 'new' || this.activeSection === 'submit' || this.activeAction === 'new';
  }

  trackById(_: number, item: { id: string }) {
    return item.id;
  }

  private isCurrentUser(userId?: string) {
    if (!userId) {
      return false;
    }
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return false;
    }
    try {
      const user = JSON.parse(userStr);
      return user?.id === userId || user?.userId === userId;
    } catch {
      return false;
    }
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
