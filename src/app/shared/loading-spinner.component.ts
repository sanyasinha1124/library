import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isLoading" style="text-align: center; padding: 30px;">
      <div class="spinner"></div>
      <p style="margin-top: 10px; color: #666;">Loading...</p>
    </div>
  `,
  styles: [`
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #ddd;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() isLoading: boolean = false;
}
