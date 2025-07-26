import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserPermissionDto } from '../dtos/permission.dto';
import { AuthService } from '../auth.service';
import { PermissionService } from '../permission.service';
import { CommonModule } from '@angular/common';
import {
  CustomSelectComponent,
  FlatButtonComponent,
  CustomInputComponent,
  SubmitRoundedButtonComponent,
} from '@erp/core';
import { RoleDto } from '../dtos/role.dto';
import { AddRoleDialogComponent } from './add-role-dialog/add-role-dialog.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'lib-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.css'],
  imports: [
    CustomSelectComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlatButtonComponent,
    CustomInputComponent,
    AddRoleDialogComponent,
    RouterModule,
  ],
})
export class ManageRoleComponent implements OnInit {
  selectedRoleId = '';
  roleControl = new FormControl();
  searchTerm = '';
  roleForm!: FormGroup;
  permissionList?: UserPermissionDto[] = [];
  roleList: RoleDto[] = [];
  isProcessing = false;
  isDialogOpen = false;
  roleName = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private permissionService: PermissionService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.loadRoles();
    // this.loadPermissions();
    this.roleControl.valueChanges.subscribe((roleId) => {
      console.log('selected role: ', roleId);
      this.selectedRoleId = roleId;
      this.loadRolePermissions();
    });

    this.roleForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
    setTimeout(() => {
      this.activatedRoute.queryParams.subscribe((params) => {
        console.log('Query Params: ', params);
        this.roleName = params['roleName'] || '';
        if (params['roleName'] && this.roleList.length > 0) {
          const found = this.roleList.find((a) => a.name == this.roleName)?.id || '';

          console.log('Selected Role from query params: ', found, this.roleName);
          this.roleControl.setValue(this.roleName);
               this.selectedRoleId = found;
                this.loadRolePermissions();
        }
      });
    }, 1000);
  }
  handleDialogClose(data: any | null) {
    this.isDialogOpen = false;
    if (data) {
      console.log('Role Created:', data);
      this.loadRoles();
    }
  }
  openDialog() {
    this.isDialogOpen = true;
  }

  get filteredPermissions() {
    const term = this.searchTerm.toLowerCase();
    return this.permissionList?.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }
  loadRoles() {
    this.authService.getAllRoles().subscribe((res) => {
      console.log('roles: ', res);
      this.roleList = res.data ?? [];
    });
  }
  loadPermissions() {
    this.authService.getPermissions().subscribe((res) => {
      this.permissionList = res.data ?? [];
    });
  }
  assignPermission(permission: UserPermissionDto) {
    this.permissionService
      .assignRoleAPermission(this.selectedRoleId, permission.name)
      .subscribe((res) => {
        console.log('assign res: ', res);
        const index = this.permissionList?.findIndex(
          (a) => a.id == permission.id
        );
        if (
          this.permissionList &&
          index !== undefined &&
          index !== null &&
          index > -1 &&
          this.permissionList[index]
        ) {
          this.permissionList[index].assigned = true;
        }
      });
  }

  revokePermission(permission: UserPermissionDto) {
    this.permissionService
      .revokeRolePermission(this.selectedRoleId, permission.name)
      .subscribe((res) => {
        console.log('revoke res: ', res);
        const index = this.permissionList?.findIndex(
          (a) => a.id === permission.id
        );
        if (
          this.permissionList &&
          typeof index === 'number' &&
          index > -1 &&
          this.permissionList[index]
        ) {
          this.permissionList[index].assigned = false;
        }
      });
  }
  loadRolePermissions() {
    if (this.selectedRoleId) {
      this.permissionService
        .getRolePermissions(this.selectedRoleId)
        .subscribe((res) => {
          this.permissionList = res.data ?? [];
        });
    }
  }
  onAddRole() {
    throw new Error('Method not implemented.');
  }
}
