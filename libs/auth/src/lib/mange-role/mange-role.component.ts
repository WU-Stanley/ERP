import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import {
  CustomInputComponent,
  CustomSelectComponent,
  SubmitRoundedButtonComponent,
} from '@erp/core';
import { AuthService } from '../auth.service';
import { Role, RoleService } from '../role.service';


@Component({
  selector: 'lib-mange-role',
  templateUrl: './mange-role.component.html',
  styleUrls: ['./mange-role.component.css'],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CustomInputComponent,
    CustomSelectComponent,
    SubmitRoundedButtonComponent,
  ],
})
export class MangeRoleComponent implements OnInit {
  roles: Role[] = [];
  newRole: Partial<Role> = {};
  constructor(private authService: AuthService,private roleService:RoleService) {}
  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
        this.roleService.getRoles().subscribe(roles =>{
          console.log('Roles:',roles);
      this.roles=roles;
    })
  }

  addRole() {
    if (this.newRole.name && this.newRole.description) {
      const newId = this.roles.length
        ? Math.max(...this.roles.map((r) => r.id)) + 1
        : 1;
      this.roles.push({
        id: newId,
        name: this.newRole.name,
        description: this.newRole.description,
      } as Role);
      this.newRole = {};
    }
  }

  removeRole(id: number) {
    this.roles = this.roles.filter((role) => role.id !== id);
  }
}
