import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService, RoleDto, RoleService, UserDto } from '@erp/auth';
import {
  CustomInputComponent,
  CustomSelectComponent,
  FlatButtonComponent,
  SubmitRoundedButtonComponent,
  AddButtonComponent,
} from '@erp/core';
import { ApprovalWorkflowService } from '../../../services/approval-workflow.service';
import { CreateApprovalFlowDto } from '../../../dtos/leave.dto';
@Component({
  selector: 'lib-approval-workflow',
  templateUrl: './approval-workflow.component.html',
  styleUrls: ['./approval-workflow.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomInputComponent,
    CustomSelectComponent,
    SubmitRoundedButtonComponent,
    FlatButtonComponent,
    AddButtonComponent,
  ],
})
export class ApprovalWorkflowComponent implements OnInit {
  flowEditIndex!: number;
  approvalWorkflowForm!: FormGroup;
  isProcessing = false;
  approverTypes = ['MANAGER', 'ROLE', 'USER'];
  roles: RoleDto[] = [];
  staffs: UserDto[] = [];
  usersTryAgain = 0;
  rolesTryAgain = 0;
  showForm = false;
  approvalWorkflows: CreateApprovalFlowDto[] = [];
  isShow = false;
  activeMenuIndex: any;
  isEditting = false;
  selectedWorkflow!: CreateApprovalFlowDto;
  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private approvalWorkflowService: ApprovalWorkflowService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getRoles();
    this.getUsers();
    this.getApprovalWorkflows();
    this.approvalWorkflowForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      createdAt: [''],
      createdBy: [''],
      isActive: [true],
      steps: this.fb.array([]),
    });
  }
  viewWrokflow(index: number) {
    this.toggleMenu(this.activeMenuIndex);
  }

  toggleMenu(index: number) {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }
  editWorkflow(index: number) {
    this.isEditting = true;
    this.selectedWorkflow = this.approvalWorkflows[index];
    console.log('selected: ', this.selectedWorkflow);
    this.approvalWorkflowForm.patchValue(this.selectedWorkflow);
    this.selectedWorkflow.steps?.forEach((step) => {
      this.steps.push(
        this.fb.group({
          stepOrder: [step.stepOrder],
          approverType: [step.approverType],
          approverValue: [step.approverValue],
        })
      );
    });
    this.toggleMenu(this.activeMenuIndex);
    this.toggleForm();
  }

  getRoleName(roleId: string): string {
    const role = this.roles.find((r) => r.id === roleId);
    return role ? role.name : roleId;
  }

  getUserName(userId: string): string {
    const user = this.staffs.find((s) => s.id === userId);
    return user ? user.fullName : userId;
  }

  addStep() {
    const step = this.fb.group({
      stepOrder: [this.steps.length + 1, Validators.required],
      approverType: ['', Validators.required],
      approverValue: [''],
    });
    this.steps.push(step);
  }
  getRoles() {
    this.roleService.getRoles().subscribe(
      (roles) => {
        this.roles = roles.data || [];
        console.log('roles: ', this.roles);
      },
      (error) => {
        console.error('Error fetching roles:', error);
        if (error.status === 401 && this.rolesTryAgain < 3) {
          setTimeout(() => {
            this.getRoles();
            this.rolesTryAgain++;
          }, 2000);
        }
      }
    );
  }
  getUsers() {
    this.authService.getAllStaff().subscribe(
      (staff) => {
        this.staffs = staff.data || [];
        console.log('users: ', staff);
      },
      (error) => {
        console.error('Error fetching users:', error);
        if (error.status === 401 && this.usersTryAgain < 3) {
          setTimeout(() => {
            this.getUsers();
            this.usersTryAgain++;
          }, 2000);
        }
      }
    );
  }
  getApproverTypeValue(i: number) {
    return this.steps.at(i).get('approverType')?.value;
  }
  get steps() {
    return this.approvalWorkflowForm.get('steps') as FormArray;
  }
  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  addVisibility() {
    const visibility = this.fb.group({
      visibilityName: ['', Validators.required],
      visibilityValue: ['', Validators.required],
    });
    this.visibilityJson.push(visibility);
  }
  get visibilityJson() {
    return this.approvalWorkflowForm.get('visibilityJson') as FormArray;
  }
  removeVisibility(index: number) {
    this.visibilityJson.removeAt(index);
  }
  getApprovalWorkflows() {
    this.approvalWorkflowService.getApprovalWorkflows().subscribe(
      (response) => {
        console.log('Approval Workflows:', response);

        this.approvalWorkflows = (response.data || []).map((a: any) => {
          return {
            ...a,
            steps:
              a.steps?.sort((x: any, y: any) => x.stepOrder - y.stepOrder) ||
              [],
          };
        });

        console.log('Sorted Approval Workflows:', this.approvalWorkflows);
      },
      (error) => {
        console.error('Error fetching approval workflows:', error);
        if (error.status === 401 && this.usersTryAgain < 3) {
          setTimeout(() => {
            this.getApprovalWorkflows();
            this.usersTryAgain++;
          }, 2000);
        }
      }
    );
  }

  onSubmit() {
    console.log('Form Submitted', this.approvalWorkflowForm.value);
    this.isProcessing = true;
    const formData = this.approvalWorkflowForm.value;
    formData.createdBy = this.authService.user()?.id || '';
    formData.createdAt = new Date().toISOString();
    if (this.approvalWorkflowForm.valid) {
      if (!this.isEditting) {
        this.approvalWorkflowService.createApprovalWorkflow(formData).subscribe(
          (res) => {
            console.log('res: ', res);
            if (res.data) {
              this.approvalWorkflows.push(res.data);
            }
            this.isProcessing = false;
            this.toggleForm();
          },
          (error) => {
            this.isProcessing = false;
            console.log('Error creating approval flow: ', error);
          }
        );
      } else {
        console.log('workflow form: ', this.approvalWorkflowForm.value);
        formData.createdBy = this.selectedWorkflow.createdBy;
        formData.createdAt = this.selectedWorkflow.createdAt;
        console.log('updateVal: ', formData);

        this.approvalWorkflowService
          .updateApprovalWorkflow(this.selectedWorkflow.id!, formData)
          .subscribe(
            (res) => {
              console.log('workflow update: ', res);
              this.isProcessing = false;
              this.getApprovalWorkflows();
            },
            (error) => {
              this.isProcessing = false;
              console.log('Error creating approval flow: ', error);
            }
          );
      }
    } else {
      console.log('Form not valid: ', this.approvalWorkflowForm.errors);
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    // this.resetForm(); // optional: reset form when opening
  }
  resetForm() {
    this.approvalWorkflowForm.reset();
    (this.approvalWorkflowForm.get('steps') as FormArray).clear();
  }
}
