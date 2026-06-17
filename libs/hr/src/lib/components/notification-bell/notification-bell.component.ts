import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'lib-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html'
})
export class NotificationBellComponent implements OnInit {
  constructor(public readonly notificationService: NotificationService) {}

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
}
