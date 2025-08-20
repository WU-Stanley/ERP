import {
  Directive,
  Input,
  ElementRef,
  Renderer2,
  OnChanges,
  SimpleChanges,
  Optional,
} from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
  selector: '[libDisableContainer]',
})
export class DisableContainerDirective implements OnChanges {
  @Input('libDisableContainer') isDisabled = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() private controlContainer: ControlContainer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isDisabled']) {
      this.toggleNativeInputs(this.isDisabled);
      this.toggleReactiveFormControls(this.isDisabled);
      this.toggleCustomComponents(this.isDisabled);
    }
  }

  private toggleNativeInputs(disabled: boolean): void {
    const elements = this.el.nativeElement.querySelectorAll(
      'input, select, textarea, button'
    );
    elements.forEach((el: HTMLElement) => {
      this.renderer.setProperty(el, 'disabled', disabled);
    });
  }

  private toggleReactiveFormControls(disabled: boolean): void {
    if (
      this.controlContainer?.control &&
      this.controlContainer.control instanceof
        (window as any).ng.forms.FormGroup
    ) {
      const formGroup = this.controlContainer
        .control as import('@angular/forms').FormGroup;
      Object.keys(formGroup.controls).forEach((controlName) => {
        const control = formGroup.get(controlName);
        if (control) {
          disabled
            ? control.disable({ emitEvent: false })
            : control.enable({ emitEvent: false });
        }
      });
    }
  }

  private toggleCustomComponents(disabled: boolean): void {
    const customTags = [
      'lib-custom-input',
      'lib-custom-select',
      'lib-custom-checkbox',
      'lib-submit-rounded-button',
      'lib-cancel-button',
      'lib-add-button',
      'lib-flat-button',
      'lib-custom-textarea',
    ];

    customTags.forEach((tag) => {
      const elements = this.el.nativeElement.querySelectorAll(tag);
      elements.forEach((el: HTMLElement) => {
        this.renderer.setProperty(el, 'disabled', disabled);
      });
    });
  }
}
