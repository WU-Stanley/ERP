import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '@erp/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'lib-microsoft-callback',
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="w-full max-w-md rounded bg-white p-8 text-center shadow">
        <h1 class="mb-2 text-xl font-bold text-gray-800">
          Completing Microsoft sign-in
        </h1>
        <p class="text-sm text-gray-600">{{ message }}</p>
      </div>
    </div>
  `,
})
export class MicrosoftCallbackComponent implements OnInit {
  message = 'Please wait while we sign you in.';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  ngOnInit() {
    try {
      this.authService.completeMicrosoftLogin().subscribe({
        next: (res) => {
          const loginPayload = res?.data?.token ? res.data : res;

          if (res?.status === false || !loginPayload?.token) {
            this.handleFailure(res.message || 'Microsoft sign-in failed.');
            return;
          }

          this.authService.setEnv(loginPayload);
          this.alertService.showSuccess('Microsoft sign-in successful!');
          this.router.navigate(['/hr/dashboard']);
        },
        error: (error) => {
          this.handleFailure(error?.error?.message ?? 'Microsoft sign-in failed.');
        },
      });
    } catch (error) {
      this.handleFailure(
        error instanceof Error ? error.message : 'Microsoft sign-in failed.'
      );
    }
  }

  private handleFailure(message: string) {
    this.message = message;
    this.alertService.showError(message);
    this.router.navigate(['/auth/login']);
  }
}
