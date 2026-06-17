import {
  Component,
  forwardRef,
  Input,
  ViewEncapsulation,
  OnDestroy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Heading,
  Link,
  BlockQuote,
  Indent,
  IndentBlock,
  Undo,
  Essentials,
  Paragraph,
  FontSize,
  FontColor,
  HorizontalLine,
  Table,
  TableToolbar,
  type EditorConfig,
} from 'ckeditor5';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, CKEditorModule],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="rich-editor-wrapper" [class.editor-disabled]="isDisabled">
      <ckeditor
        [editor]="Editor"
        [config]="editorConfig"
        [disabled]="isDisabled"
        [data]="value"
        (change)="onEditorChange($event)"
        (ready)="onReady()"
      ></ckeditor>
    </div>
  `,
  styles: [`
    .rich-editor-wrapper .ck-editor__editable {
      min-height: 160px;
      max-height: 420px;
      font-size: 14px;
      line-height: 1.6;
      border-bottom-left-radius: 0.5rem !important;
      border-bottom-right-radius: 0.5rem !important;
    }
    .rich-editor-wrapper .ck-toolbar {
      border-top-left-radius: 0.5rem !important;
      border-top-right-radius: 0.5rem !important;
      border-color: #d1d5db !important;
      background: #f9fafb !important;
    }
    .rich-editor-wrapper .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
      border-color: #16a34a !important;
      box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15) !important;
    }
    .rich-editor-wrapper .ck-editor__editable {
      border-color: #d1d5db !important;
    }
    .rich-editor-wrapper.editor-disabled .ck-editor__editable {
      background: #f3f4f6 !important;
      cursor: not-allowed;
    }
    .rich-editor-wrapper .ck-content ul {
      list-style-type: disc;
      padding-left: 1.5rem;
    }
    .rich-editor-wrapper .ck-content ol {
      list-style-type: decimal;
      padding-left: 1.5rem;
    }
  `],
})
export class RichTextEditorComponent implements ControlValueAccessor, OnDestroy {
  @Input() placeholder = '';

  private readonly cdr = inject(ChangeDetectorRef);

  Editor = ClassicEditor;
  value = '';
  isDisabled = false;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  editorConfig: EditorConfig = {
    licenseKey: 'GPL',
    plugins: [
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      List,
      Heading,
      Link,
      BlockQuote,
      Indent,
      IndentBlock,
      Undo,
      FontSize,
      FontColor,
      HorizontalLine,
      Table,
      TableToolbar,
    ],
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'fontSize',
        'fontColor',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'link',
        'blockQuote',
        'horizontalLine',
        'insertTable',
        '|',
        'undo',
        'redo',
      ],
      shouldNotGroupWhenFull: true,
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      ],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    placeholder: this.placeholder,
  };

  onReady(): void {
    // editor ready
  }

  onEditorChange(event: { editor: ClassicEditor }): void {
    const data = event.editor.getData();
    this.onChange(data);
    this.onTouched();
  }

  // ControlValueAccessor
  writeValue(val: string): void {
    this.value = val ?? '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnDestroy(): void {}
}
