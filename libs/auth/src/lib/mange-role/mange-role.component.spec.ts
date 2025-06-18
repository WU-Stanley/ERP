/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MangeRoleComponent } from './mange-role.component';

describe('MangeRoleComponent', () => {
  let component: MangeRoleComponent;
  let fixture: ComponentFixture<MangeRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangeRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
