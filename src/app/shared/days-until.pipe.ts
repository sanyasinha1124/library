import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'daysUntil', standalone: true, pure: true })
export class DaysUntilPipe implements PipeTransform {
  transform(dateStr: string): string {
    if (!dateStr) return '';
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diff = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Due today';
    if (diff > 0) return `${diff} days left`;
    return `${Math.abs(diff)} day${Math.abs(diff) > 1 ? 's' : ''} overdue`;
  }
}
