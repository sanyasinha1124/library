import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
<div *ngIf="visible" class="overlay">

  <div class="dialog-box">

    <div class="dialog-header">
      <h3>Confirm Action</h3>
    </div>

    <div class="dialog-body">
      <p>{{ message }}</p>
    </div>

    <div class="dialog-actions">
      <button class="cancel-btn" (click)="cancelled.emit()">
        Cancel
      </button>

      <button class="confirm-btn" (click)="confirmed.emit()">
        Confirm
      </button>
    </div>

  </div>

</div>
`,
styles: [`

/* OVERLAY */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* DIALOG */
.dialog-box {
  background: white;
  width: 400px;
  max-width: 90%;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  overflow: hidden;
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.dialog-header {
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.dialog-body {
  padding: 20px;
  font-size: 14px;
  color: #475569;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

/* BUTTONS */
.dialog-actions button {
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

.cancel-btn {
  background: #f1f5f9;
  color: #334155;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.confirm-btn {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
}

.confirm-btn:hover {
  transform: scale(1.05);
}
`]
})
export class ConfirmDialogComponent {
  @Input() message: string = 'This action cannot be undone.';
  @Input() visible: boolean = false;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
