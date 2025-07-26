import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';
import {
  CustomSelectComponent,
  SpinnerComponent,
  SubmitRoundedButtonComponent,
} from '@erp/core';
import { AuthService } from '../auth.service';
import { RoleService } from '../role.service';
import { RoleDto } from '../dtos/role.dto';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserDto } from '../dtos/usertype.dto';

@Component({
  selector: 'lib-mange-role',
  templateUrl: './manage-staff-role.component.html',
  styleUrls: ['./manage-staff-role.component.css'],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CustomSelectComponent,
    SpinnerComponent,
    SubmitRoundedButtonComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ManageStaffRoleComponent implements OnInit {
  roles: RoleDto[] = [];
  newRole: Partial<RoleDto> = {};
  staffList: UserDto[] = [];
  roleForm!: FormGroup;
  userRoles: RoleDto[] = [];
  selectedStaffId = '';
  isProcessing = false;

  constructor(
    private authService: AuthService,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      userId: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
    });
    this.loadStaffs();
    this.roleForm.get('userId')?.valueChanges.subscribe((userId: string) => {
      console.log('user id selected: ', userId);
      this.selectedStaffId = userId;
      this.loadUserRoles(userId);
    });
    this.loadRoles();
  }

  loadRoles(): void {
    console.log('loading roles');
    this.roleService.getRoles().subscribe((roles: any) => {
      console.log('Roles:', roles);
      this.roles = roles.data ?? [];
    });
  }

  loadUserRoles(userId: string): void {
    this.isProcessing = true;
    this.authService.getUserRoles(userId).subscribe((res) => {
      console.log('user roles: ', res);
      this.userRoles = res.data! ?? [];
      this.isProcessing = false;
    });
  }

  loadStaffs(): void {
    this.authService.getAllStaff().subscribe((res) => {
      console.log('user list res: ', res);
      this.staffList = res.data ?? [];
    });
  }
  assignRole() {
    console.log('assigning role: ', this.roleForm.value);
    this.authService.assignRoleToUser(this.roleForm.value).subscribe(res =>{
      console.log('Assign role res: ',res);
      this.loadUserRoles(this.roleForm.value.userId);
    })
  }
  removeRole(role: RoleDto): void {
    this.authService
      .removeRoleFromUser(this.selectedStaffId, role.id)
      .subscribe((res: any) => {
        console.log('res: ', res);
        if (res != null) {
          this.userRoles = this.userRoles.filter((u: RoleDto) => u.id != role.id);
        }
      });
  }
}
