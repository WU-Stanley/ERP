import { Component, OnInit } from '@angular/core';
import { RoleService } from '../role.service';
import { RoleDto } from '../dtos/role.dto';
import { CustomInputComponent, FlatButtonComponent, SubmitRoundedButtonComponent } from '@erp/core';
import {   FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
  imports: [
    CustomInputComponent, 
    FlatButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    FlatButtonComponent,
    RouterModule,
    CommonModule,
    SubmitRoundedButtonComponent
  ],
})
export class RoleListComponent implements OnInit {
  roles: RoleDto[] = [];
  searchTerm = '';
  isProcessing = false;
  isDialogOpen = false;
  roleForm!: FormGroup;
  constructor(private roleService: RoleService, private router: Router,private fb:FormBuilder) {}

  ngOnInit() {
    this.loadRoles();
     this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  openDialog() {
    this.isDialogOpen = true;
  }
  handleDialogClose(data: any | null) {
    this.isDialogOpen = false;
    if (data) {
      console.log('Role Created:', data);
      this.loadRoles();
    }
  }
  get filteredRoles() {
    const term = this.searchTerm.toLowerCase();
    return this.roles?.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }
  loadRoles() {
    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles.data || [];
    });
  }
  manageRolePermission(roleName: string) {
    this.router.navigate(['/auth/mroles', roleName]);
  } onAddRole() {
    if (this.roleForm.invalid) return;

    this.isProcessing = true;
 
    this.roleService.addRole(this.roleForm.value).subscribe(res => {
      console.log("new role: ", res);
      this.isProcessing = false;
      // this.closed.emit(this.roleForm.value);
      this.handleDialogClose(this.roleForm.value);
    });
  }
}
