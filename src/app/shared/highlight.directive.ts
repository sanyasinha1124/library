import { Directive, HostListener, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  // The caller can pass a colour like: appHighlight="lightyellow"
  @Input() appHighlight: string = 'lightyellow';

  // This binds to the element's background style
  @HostBinding('style.backgroundColor') bgColor: string = '';
  @HostBinding('style.transition') transition = 'background-color 0.2s';

  @HostListener('mouseenter')
  onMouseEnter() {
    this.bgColor = this.appHighlight;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.bgColor = '';
  }
}