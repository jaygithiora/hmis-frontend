import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { PackagesService } from '@services/dashboard/subscriptions/packages/packages.service';
import { duration } from 'moment';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

// Extend JQuery interface for summernote
declare global {
  interface JQuery {
    summernote(options?: any): JQuery;
    summernote(command: string, ...args: any[]): any;
  }
}

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss'
})
export class PackageComponent implements OnInit,AfterViewInit, OnDestroy, OnChanges {
  public isLoading: boolean = false;

  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  @Input() content = '';
  @Input() height = 400;

  @Output() contentChange = new EventEmitter<string>();

  private initialized = false;
  private settingContent = true;

  packageForm:FormGroup;

  duration_types = [{id:"daily",name:"Daily"}, {id:"weekly",name:"Weekly"}, {id:"monthly", name:"Monthly"}, {id:"yearly",name:"Yearly"}];

  constructor(private fb:FormBuilder, private toastr:ToastrService, private packagesService:PackagesService, 
    private service:AuthService,private router:Router, private activatedRoute: ActivatedRoute){
    this.packageForm = this.fb.group({
      id:['0', [Validators.required]],
      name:['', [Validators.required]],
      description:[''],
      grace_period:['0', [Validators.required]],
      duration_type:['daily', [Validators.required]],
      amount:['', [Validators.required]],
    });
  }
  
ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.packageForm.get("id").setValue(id);
      this.isLoading = true;
      this.packagesService.getSubscriptionPackage(parseInt(id)).subscribe((result: any) => {
        this.content = result.subscription_package.description;
        this.setContent(this.content);
        this.packageForm.get("name").setValue(result.subscription_package.name);
        this.packageForm.get("amount").setValue(result.subscription_package.amount);
        this.packageForm.get("grace_period").setValue(result.subscription_package.grace_period);
        this.packageForm.get("duration_type").setValue(result.subscription_package.duration_type);
        this.isLoading = false;
      }, error => {
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    } /*else {
      this.router.navigate(["dashboard/subscriptions/packages"]);
    }*/
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
  }
  addSubscriptionPackage() {
    if (this.packageForm.valid) {
      this.isLoading = true;
      this.packageForm.get("description").setValue(this.getContent());
      this.packagesService.updateSubscriptionPackage(this.packageForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["dashboard/subscriptions/packages"])
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.name) {
          this.toastr.error(error?.error?.errors?.name);
        }
        if (error?.error?.errors?.description) {
          this.toastr.error(error?.error?.errors?.description);
        }
        if (error?.error?.errors?.duration) {
          this.toastr.error(error?.error?.errors?.duration);
        }
        if (error?.error?.errors?.amount) {
          this.toastr.error(error?.error?.errors?.amount);
        }
        if (error?.error?.errors?.duration_type) {
          this.toastr.error(error?.error?.errors?.duration_type);
        }
        if (error?.error?.error) {
          this.toastr.error(error?.error?.error);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.packageForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

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
      placeholder: 'Package Description...',
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
