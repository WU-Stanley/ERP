import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CustomInputComponent,
  CustomSelectComponent,
  FlatButtonComponent,
} from '@erp/core';
import { AuthService } from '../auth.service';
import { UserDto } from '../dtos/usertype.dto';
import {  UserPermissionDto } from '../dtos/permission.dto';
import { PermissionService } from '../permission.service';

@Component({
  selector: 'lib-mange-permission',
  templateUrl: './mange-permission.component.html',
  styleUrls: ['./mange-permission.component.css'],
  imports: [
    CustomSelectComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlatButtonComponent,
    CustomInputComponent,
  ],
})
export class MangePermissionComponent implements OnInit {
  selectedStaffId='';
  constructor(private authService:AuthService,private permissionService:PermissionService){}
  ngOnInit(): void {
this.loadStaffList();
// this.loadPermissions();
this.staffControl.valueChanges.subscribe(staffId =>{
  console.log('selected staff: ',staffId);
  this.selectedStaffId =staffId;
  this.loadStaffPermissions()
})
  }
  searchTerm = '';
  staffControl = new FormControl();
  staffList:UserDto[] = [ ];

  permissionList?:UserPermissionDto[]=[];

  // permissionList = [
  //   {
  //     id: 1,
  //     name: 'Add User',
  //     description: 'Allows adding users',
  //     status: 'Revoked',
  //   },
  //   {
  //     id: 2,
  //     name: 'Edit User',
  //     description: 'Allows editing user details',
  //     status: 'Assigned',
  //   },
  //   {
  //     id: 3,
  //     name: 'Delete User',
  //     description: 'Allows removing user accounts',
  //     status: 'Revoked',
  //   },
  //   {
  //     id: 4,
  //     name: 'View Reports',
  //     description: 'Access to reports',
  //     status: 'Assigned',
  //   },
  //   {
  //     id: 5,
  //     name: 'Export Reports',
  //     description: 'Download reports as files',
  //     status: 'Revoked',
  //   },
  //   {
  //     id: 6,
  //     name: 'Manage Settings',
  //     description: 'Access to system settings',
  //     status: 'Revoked',
  //   },
  //   {
  //     id: 7,
  //     name: 'Assign Roles',
  //     description: 'Ability to assign user roles',
  //     status: 'Assigned',
  //   },
  //   {
  //     id: 8,
  //     name: 'Send Notifications',
  //     description: 'Trigger system alerts',
  //     status: 'Revoked',
  //   },
  //   {
  //     id: 9,
  //     name: 'Manage Billing',
  //     description: 'Billing section access',
  //     status: 'Revoked',
  //   },
  //   {
  //     id: 10,
  //     name: 'View Invoices',
  //     description: 'View past invoices',
  //     status: 'Assigned',
  //   },
  // ];

  get filteredPermissions() {
    const term = this.searchTerm.toLowerCase();
    return this.permissionList?.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }
loadStaffList(){
  this.authService.getAllStaff().subscribe(res=>{
    console.log('res: ',res)
    this.staffList =res.data ??[];
  })
}
loadPermissions(){
  this.authService.getPermissions().subscribe(res =>{
    this.permissionList = (res.data??[]);
  })
}
  assignPermission(permission:UserPermissionDto) {
   this.permissionService.assignUserPermission(this.selectedStaffId,permission.name).subscribe(res =>{
    console.log('assign res: ',res);
   const index = this.permissionList?.findIndex(a => a.id == permission.id);
   if (
     this.permissionList &&
     index !== undefined &&
     index !== null &&
     index > -1 &&
     this.permissionList[index]
   ) {
     this.permissionList[index].assigned = true;
   }
   })
  }

  revokePermission(permission:UserPermissionDto) {
   this.permissionService.revokeUserPermission(this.selectedStaffId,permission.name).subscribe(res=>{
    console.log('revoke res: ',res)
    const index = this.permissionList?.findIndex(a => a.id === permission.id);
    if (
      this.permissionList &&
      typeof index === 'number' &&
      index > -1 &&
      this.permissionList[index]
    ) {
      this.permissionList[index].assigned = false;
    }
   })
  }
  loadStaffPermissions(){
if(this.selectedStaffId){
  this.permissionService.getUserPermissions(this.selectedStaffId).subscribe(res =>{
 
    this.permissionList=(res.data??[]);
    
  })
}
  }
}
