import { Component, OnInit } from '@angular/core';
import { FlatButtonComponent } from "@erp/core";
import { LeaveTypeService } from '../../../services/leave-type.service';
import { LeaveTypeDto } from '../../../dtos/leave.dto';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'lib-leave-type',
  templateUrl: './leave-type.component.html',
  styleUrls: ['./leave-type.component.css'],
  imports: [FlatButtonComponent,CommonModule,FormsModule,ReactiveFormsModule]
})
export class LeaveTypeComponent implements OnInit {
  showForm=false;
leaveTypes: LeaveTypeDto[]=[];


  constructor(private leaveTypeService:LeaveTypeService) { }

  ngOnInit() {this.getLeaveTypes();
  }
showLeaveTypeForm() {
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
