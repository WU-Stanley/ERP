import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { AuthService } from "../auth.service";

@Directive({
  selector: '[libHasRole]'
})
export class HasRoleDirective {
  @Input() set appHasRole(role: string) {
    const hasRole = this.auth.hasRole(role);
    this.viewContainer[hasRole ? 'createEmbeddedView' : 'clear'](this.templateRef);
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {}
}
