import { Component, OnInit } from '@angular/core';
import {  AddButtonComponent, FlatButtonComponent } from "@erp/core";
import { LeaveTypeService } from '../../../services/leave-type.service';
import { LeaveTypeDto } from '../../../dtos/leave.dto';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeaveTypeFormComponent } from "../leave-type-form/leave-type-form.component";

@Component({
  selector: 'lib-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css'],
  imports: [ CommonModule, FormsModule, ReactiveFormsModule,
    FlatButtonComponent,
     AddButtonComponent, LeaveTypeFormComponent]
})
export class LeaveTypeComponent implements OnInit {
addLeavePolicy(arg0: string) {
throw new Error('Method not implemented.');
}
  showForm=false;
leaveTypes: LeaveTypeDto[]=[];


  constructor(private leaveTypeService:LeaveTypeService) { }

  ngOnInit() {this.getLeaveTypes();
  }
toggleLeaveTypeForm() {
this.showForm = !this.showForm;
}
getLeaveTypes(){
  this.leaveTypeService.getLeaveTypes().subscribe(res =>{
    this.leaveTypes = res.data??[];
    console.log("leave types: ",res)
  })
}
activeMenuIndex: number | null = null;

toggleMenu(index: number) {
  this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
}

viewLeaveType(id: string) {
  // your logic

  this.toggleMenu(this.activeMenuIndex!)
}

editLeaveType(id: string) {
  // your logic

  
  this.toggleMenu(this.activeMenuIndex!)
}

}
