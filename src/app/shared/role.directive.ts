import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[appRole]',
  standalone: true
})
export class RoleDirective implements OnInit {
  @Input() appRole: string = '';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser$.getValue();
    if (user && user.role === this.appRole) {
      // Show the element
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Hide the element
      this.viewContainer.clear();
    }
  }
}
