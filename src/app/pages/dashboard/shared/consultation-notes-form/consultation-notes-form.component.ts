import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { After } from 'v8';


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
export class ConsultationNotesFormComponent implements AfterViewInit, OnDestroy{

  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>; 
  
  @Input() content = '';
  @Input() height = 200;

  @Output() contentChange = new EventEmitter<string>();

  private initialized = false;


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
      $(this.editor.nativeElement).summernote('code', "");
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
