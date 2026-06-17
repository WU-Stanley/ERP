import { Injectable, signal, effect, DestroyRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@erp/auth';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsApi = 'https://localhost:8000/api/notifications';
  private hubConnection?: HubConnection;
  private readonly destroyRef = inject(DestroyRef);

  readonly notifications = signal<AppNotification[]>([]);
  readonly unreadCount = signal(0);
  readonly isConnecting = signal(false);
  readonly lastError = signal<string | null>(null);

  constructor(private readonly http: HttpClient, private readonly auth: AuthService) {
    effect(() => {
      this.unreadCount.set(this.notifications().filter((item) => !item.isRead).length);
    });
  }

  startConnection() {
    const token = this.auth.getAccessToken();
    if (!token) {
      return;
    }

    this.isConnecting.set(true);
    this.lastError.set(null);

    // Use the HTTPS base URL — SignalR negotiates the WebSocket upgrade internally.
    // Do NOT convert to wss:// manually; doing so skips the /negotiate endpoint.
    const hubUrl = this.notificationsApi.substring(0, this.notificationsApi.lastIndexOf('/')) + '/notificationsHub';

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    // Listen for real-time notifications pushed from the server
    this.hubConnection.on('NewNotification', (notification: AppNotification) => {
      this.notifications.update((list) => [notification, ...list]);
      this.lastError.set(null);
    });

    this.hubConnection.onreconnecting((error) => {
      this.lastError.set(`Reconnecting: ${error?.message ?? 'Unknown error'}`);
    });

    this.hubConnection.onreconnected((connectionId) => {
      this.lastError.set(null);
    });

    this.hubConnection
      .start()
      .then(() => {
        this.isConnecting.set(false);
        this.loadNotifications();
        this.loadUnreadCount();
      })
      .catch((err) => {
        this.isConnecting.set(false);
        this.lastError.set(`SignalR connection failed: ${err.message}`);
      });

    // Periodically refresh unread count
    this.loadUnreadCount();
  }

  private loadNotifications() {
    this.http
      .get<{ data: AppNotification[] }>(`${this.notificationsApi}?limit=20`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.notifications.set(res.data ?? []), () => {});
  }

  private loadUnreadCount() {
    this.http
      .get<{ data: number }>(`${this.notificationsApi}/unread-count`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.unreadCount.set(res.data ?? 0), () => {});
  }

  markAsRead(id: string) {
    this.http.put(`${this.notificationsApi}/${id}/read`, {}).subscribe(() => {
      this.notifications.update((list) => list.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      this.loadUnreadCount();
    });
  }

  markAllAsRead() {
    this.http.put(`${this.notificationsApi}/read-all`, {}).subscribe(() => {
      this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
      this.loadUnreadCount();
    });
  }

  stopConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop();
    }
  }
}
