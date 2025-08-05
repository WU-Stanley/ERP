import {
  Component,
  Input,
  forwardRef,
  ElementRef,
  Renderer2,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'lib-custom-slider',
  templateUrl: './custom-slider.component.html',
  styleUrls: ['./custom-slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSliderComponent),
      multi: true,
    },
  ],
})
export class CustomSliderComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() color = '#064e3b'; // default dark green

  value = 0;
  disabled = false;

  private onChange = (value: number) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.updateColor();
    this.updateTrackBackground();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['color'] || changes['value']) {
      this.updateColor();
      this.updateTrackBackground();
    }
  }

  writeValue(value: number): void {
    this.value = value ?? 0;
    this.updateTrackBackground();
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = Number(input.value);
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
    this.updateTrackBackground();
  }

  private updateColor() {
    this.renderer.setStyle(this.el.nativeElement, '--slider-fill', this.color);
  }

  private updateTrackBackground() {
    const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
    const background = `linear-gradient(to right, var(--slider-fill) ${percentage}%, #e5e7eb ${percentage}%)`; // Tailwind gray-200 fallback
    const input = this.el.nativeElement.querySelector('input[type="range"]');
    if (input) {
      this.renderer.setStyle(input, 'background', background);
    }
  }
}
