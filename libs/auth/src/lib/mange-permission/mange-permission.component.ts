import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomSelectComponent } from '@erp/core';
 
@Component({
  selector: 'lib-mange-permission',
  templateUrl: './mange-permission.component.html',
  styleUrls: ['./mange-permission.component.css'],
  imports: [CustomSelectComponent,CommonModule,FormsModule]
})
export class MangePermissionComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
 searchTerm = '';

  staffList = [
    { id: 1, name: 'Alice Johnson' },
    { id: 2, name: 'Bob Smith' },
    { id: 3, name: 'Charlie Daniels' }
  ];

  permissionList = [
    { id: 1, name: 'Add User', description: 'Allows adding users', status: 'Revoked' },
    { id: 2, name: 'Edit User', description: 'Allows editing user details', status: 'Assigned' },
    { id: 3, name: 'Delete User', description: 'Allows removing user accounts', status: 'Revoked' },
    { id: 4, name: 'View Reports', description: 'Access to reports', status: 'Assigned' },
    { id: 5, name: 'Export Reports', description: 'Download reports as files', status: 'Revoked' },
    { id: 6, name: 'Manage Settings', description: 'Access to system settings', status: 'Revoked' },
    { id: 7, name: 'Assign Roles', description: 'Ability to assign user roles', status: 'Assigned' },
    { id: 8, name: 'Send Notifications', description: 'Trigger system alerts', status: 'Revoked' },
    { id: 9, name: 'Manage Billing', description: 'Billing section access', status: 'Revoked' },
    { id: 10, name: 'View Invoices', description: 'View past invoices', status: 'Assigned' }
  ];

  get filteredPermissions() {
    const term = this.searchTerm.toLowerCase();
    return this.permissionList.filter(p =>
      p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
    );
  }

  assignPermission(permission: any) {
    permission.status = 'Assigned';
  }

  revokePermission(permission: any) {
    permission.status = 'Revoked';
  }
}
