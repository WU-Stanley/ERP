import { L } from '@angular/cdk/a11y-module.d-DBHGyKoh';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import {
  Form,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SubmitRoundedButtonComponent,
  FlatButtonComponent,
  CustomInputComponent,
  CustomSelectComponent,
  CustomTextareaComponent,
} from '@erp/core';
import { LeaveTypeStore } from '../../../state';
import { LeaveRequestStore } from '../../../state/leave-request.store';

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
  leaveRequestForm!: FormGroup;
  leaveTypeStore = inject(LeaveTypeStore);

  leaveTypes = computed(() => this.leaveTypeStore.myLeaveTypes());

  leaveRequestStore = inject(LeaveRequestStore);

  isLoading = computed(() => this.leaveRequestStore.isLoading());

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (!this.leaveTypes().length) {
      this.leaveTypeStore.getMyLeaveTypes();
    }
    this.leaveRequestForm = this.fb.group({
      leaveTypeId: [''],
      startDate: [''],
      endDate: [''],
      reason: [''],
    });
  }
  toggleForm() {
    this.closeFormEvent.emit();
  }

  resetForm() {
    this.leaveRequestForm.reset();
  }

  onSubmit() {
    this.leaveRequestStore.createLeaveRequest(this.leaveRequestForm.value);
    if (!this.isLoading()) {
      this.closeFormEvent.emit();
    }
  }
}
