import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItemService } from '../../services/menu-item.service';
import { MenuItem } from 'libs/CAuth/src/lib/dto/dtos';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MenuItemsComponent } from '../menu-items/Menu-Items.component';
import { AlertService } from 'libs/core/src/lib/alert.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
  imports: [RouterModule, CommonModule, MenuItemsComponent],
  standalone: true,
  providers: [provideCharts(withDefaultRegisterables())],
})
export class StudentDashboardComponent implements OnInit {
  userName = localStorage.getItem('WUName') || 'Student';
  menuItems: MenuItem[] = [];
  constructor(
    private router: Router,
    private menuItemService: MenuItemService,
    private alertService: AlertService
  ) {}
  closeSidebar() {
    this.showSidebar = false;
  }
  showSidebar = true;

  ngOnInit() {
    console.log('student dashboard: ');
    this.getMenuItems();
  }
  getMenuItems() {
    this.menuItemService.getMenuItems().subscribe((res) => {
      console.log('Menu Items: ', res);
      this.menuItems = res.data ?? [];
    });
  }
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/student']);
  }

  menuOpen = false;
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  apply(mealId: string) {
    const studentId = localStorage.getItem('WUStudentId') || '';
    this.menuItemService.orderMeal(studentId, mealId).subscribe((res) => {
      console.log('Order response: ', res);
    });
  }
}
