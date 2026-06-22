import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppNotification, NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html'
})
export class NotificationBellComponent implements OnInit {
  constructor(public readonly notificationService: NotificationService, private readonly router: Router) {}

  openPanel = false;

  ngOnInit() {
    this.notificationService.startConnection();
  }

  get unreadCount(): number {
    return this.notificationService.unreadCount();
  }

  get notifications() {
    return this.notificationService.notifications();
  }

  togglePanel() {
    this.openPanel = !this.openPanel;
    if (!this.openPanel) {
      this.notificationService.markAllAsRead();
    }
  }

  markRead(id: string) {
    this.notificationService.markAsRead(id);
  }

  openNotification(item: AppNotification) {
    this.markRead(item.id);
    if (item.entityType === 'EmployeeOnboarding') {
      this.openPanel = false;
      this.router.navigate(['/hr/employees/ict-onboarding']);
    }
  }
}
