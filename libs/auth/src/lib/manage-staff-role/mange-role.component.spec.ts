/* tslint:disable:no-unused-variable */
import {   ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManageStaffRoleComponent } from './manage-staff-role.component';

describe('ManageStaffRoleComponent', () => {
  let component: ManageStaffRoleComponent;
  let fixture: ComponentFixture<ManageStaffRoleComponent>;
   
  beforeEach( (() => {
    TestBed.configureTestingModule({
      declarations: [ ManageStaffRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageStaffRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
