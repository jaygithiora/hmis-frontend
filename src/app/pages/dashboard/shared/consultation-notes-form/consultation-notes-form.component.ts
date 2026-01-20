import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

declare var $: any;

// Extend JQuery interface for summernote
declare global {
  interface JQuery {
    summernote(options?: any): JQuery;
    summernote(command: string, ...args: any[]): any;
  }
}

@Component({
  selector: 'app-consultation-notes-form',
  templateUrl: './consultation-notes-form.component.html',
  styleUrl: './consultation-notes-form.component.scss'
})
export class ConsultationNotesFormComponent implements AfterViewInit, OnDestroy, OnChanges {

  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  @Input() content = '';
  @Input() height = 200;

  @Output() contentChange = new EventEmitter<string>();

  private initialized = false;
  private settingContent = true;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content'] && !changes['content'].firstChange && this.settingContent) {
      this.setContent(this.content);
      this.settingContent = false;
    }
  }

  ngAfterViewInit() {
    this.initSummernote();
  }

  ngOnDestroy() {
    if (this.initialized) {
      $(this.editor.nativeElement).summernote('destroy');
    }
  }

  private initSummernote() {
    $(this.editor.nativeElement).summernote({
      height: 200,
      placeholder: 'Consultation Notes...',
      callbacks: {
        onChange: (contents: string) => {
          this.contentChange.emit(contents);
        },
      },
    });

    // Set initial content if any
    //$(this.editor.nativeElement).summernote('code', "");
    this.initialized = true;
  }

  // Allow programmatically setting content from outside
  setContent(value: string) {
    if (this.initialized) {
      $(this.editor.nativeElement).summernote('code', value);
    }
  }

  // Allow getting content programmatically
  getContent(): string {
    if (this.initialized) {
      return $(this.editor.nativeElement).summernote('code');
    }
    return '';
  }
}
