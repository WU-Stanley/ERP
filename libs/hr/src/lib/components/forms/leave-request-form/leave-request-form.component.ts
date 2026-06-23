import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SubmitRoundedButtonComponent,
  FlatButtonComponent,
  CustomInputComponent,
  CustomSelectComponent,
  CustomTextareaComponent,
  AlertService,
} from '@erp/core';
import { LeaveTypeStore } from '../../../state';
import { LeaveRequestStore } from '../../../state/leave-request.store';
import { LeaveRequestDto } from '../../../dtos';

@Component({
  selector: 'lib-leave-request-form',
  templateUrl: './leave-request-form.component.html',
  styleUrls: ['./leave-request-form.component.scss'],
  imports: [
    SubmitRoundedButtonComponent,
    FlatButtonComponent,

    CustomInputComponent,
    CustomSelectComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomTextareaComponent,
  ],
})
export class LeaveRequestFormComponent implements OnInit {
  @Output() closeFormEvent = new EventEmitter<void>();
  @Input() leaveRequest: LeaveRequestDto | null = null;
  leaveRequestForm!: FormGroup;
  leaveTypeStore = inject(LeaveTypeStore);

  leaveTypes = computed(() => this.leaveTypeStore.myLeaveTypes());

  leaveRequestStore = inject(LeaveRequestStore);

  isLoading = computed(() => this.leaveRequestStore.isLoading());

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    if (!this.leaveTypes().length) {
      this.leaveTypeStore.getMyLeaveTypes();
    }
    this.leaveRequestForm = this.fb.group({
      leaveTypeId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(1000)]],
    });

    if (this.leaveRequest) {
      this.leaveRequestForm.patchValue({
        leaveTypeId: this.leaveRequest.leaveTypeId,
        startDate: this.toDateInput(this.leaveRequest.startDate),
        endDate: this.toDateInput(this.leaveRequest.endDate),
        reason: this.leaveRequest.reason,
      });
      this.leaveRequestForm.get('leaveTypeId')?.disable();
    }
  }
  toggleForm() {
    this.closeFormEvent.emit();
  }

  resetForm() {
    this.leaveRequestForm.reset();
  }

  async onSubmit() {
    if (this.leaveRequestForm.invalid) {
      this.leaveRequestForm.markAllAsTouched();
      this.alertService.showError('Complete all required leave request fields.');
      return;
    }

    const startDate = new Date(this.leaveRequestForm.value.startDate);
    const endDate = new Date(this.leaveRequestForm.value.endDate);
    if (endDate < startDate) {
      this.alertService.showError('End date cannot be before start date.');
      return;
    }

    const payload = {
      ...this.leaveRequest,
      ...this.leaveRequestForm.getRawValue(),
    } as LeaveRequestDto;

    if (this.leaveRequest?.id) {
      await this.leaveRequestStore.updateLeaveRequest(payload);
    } else {
      await this.leaveRequestStore.createLeaveRequest(payload);
    }

    const error = this.leaveRequestStore.error();
    if (error) {
      this.alertService.showError(error);
    } else {
      this.alertService.showSuccess(
        this.leaveRequest ? 'Leave request updated successfully.' : 'Leave request submitted successfully.'
      );
      this.closeFormEvent.emit();
    }
  }

  private toDateInput(value: Date | string) {
    return new Date(value).toISOString().substring(0, 10);
  }
}
