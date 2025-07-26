import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent, FlatButtonComponent, SubmitRoundedButtonComponent } from '@erp/core';
import { RoleService } from '../../role.service';

@Component({
  selector: 'lib-add-role-dialog',
  templateUrl: './add-role-dialog.component.html',
  styleUrls: ['./add-role-dialog.component.css'],
  imports:[CustomInputComponent,FlatButtonComponent,SubmitRoundedButtonComponent
    ,ReactiveFormsModule,FormsModule,CommonModule
  ]
})
 
export class AddRoleDialogComponent {
  @Output() closed = new EventEmitter<any>();

  roleForm: FormGroup;
  isProcessing = false;

  constructor(private fb: FormBuilder, private roleService:RoleService) {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  close() {
    this.closed.emit(null);
  }

  onAddRole() {
    if (this.roleForm.invalid) return;

    this.isProcessing = true;
 
    this.roleService.addRole(this.roleForm.value).subscribe(res => {
      console.log("new role: ", res);
      this.isProcessing = false;
      this.closed.emit(this.roleForm.value);
    });
  }
}

