import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit
} from '@angular/core'; 
import { AuthService } from '../auth.service';

@Directive({
  selector: '[libHasAnyPermission]',
  standalone: true
})
export class HasAnyPermissionDirective implements OnInit {
  @Input('libHasAnyPermission') permissions: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const hasAny = this.auth.hasAnyPermission(this.permissions);
     if (hasAny || !this.permissions || this.permissions.length === 0) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
