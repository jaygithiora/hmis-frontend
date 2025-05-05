import {
  Component,
  OnInit,
  Renderer2,
  OnDestroy,
  HostBinding
} from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'register-box';

  public registerForm: UntypedFormGroup;
  public isAuthLoading = false;

  constructor(
    private renderer: Renderer2,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.renderer.addClass(
      document.querySelector('app-root'),
      'register-page'
    );
    this.registerForm = new UntypedFormGroup({
      firstname: new UntypedFormControl(null, Validators.required),
      lastname: new UntypedFormControl(null, Validators.required),
      email: new UntypedFormControl(null, Validators.required),
      phone: new UntypedFormControl(null, Validators.required),
      password: new UntypedFormControl(null, [Validators.required]),
      password_confirmation: new UntypedFormControl(null, [Validators.required]),
      terms_and_conditions: new UntypedFormControl(true, [Validators.required])
    });
  }

  async registerByAuth() {
    if (this.registerForm.valid) {
      this.isAuthLoading = true;
      this.authService.register(this.registerForm.getRawValue()).subscribe((result: any) => {
        if (result.access_token && result.user) {
          localStorage.setItem("token", result.access_token);
          localStorage.setItem('user', JSON.stringify(result.user));
        } else {
          this.toastr.error("Access token could not be found! Try again!")
        }
        this.router.navigate(['dashboard']);
        this.isAuthLoading = false;
      }, (error: any) => {
        if (error?.error?.errors?.firstname) {
          this.toastr.error(error?.error?.errors?.firstname);
        }
        if (error?.error?.errors?.lastname) {
          this.toastr.error(error?.error?.errors?.lastname);
        }
        if (error?.error?.errors?.email) {
          this.toastr.error(error?.error?.errors?.email);
        }
        if (error?.error?.errors?.phone) {
          this.toastr.error(error?.error?.errors?.phone);
        }
        if (error?.error?.errors?.password) {
          this.toastr.error(error?.error?.errors?.password);
        }
        if (error?.error?.errors?.password_confirmation) {
          this.toastr.error(error?.error?.errors?.password_confirmation);
        }
        if (error?.error?.errors?.terms_and_conditions) {
          this.toastr.error(error?.error?.errors?.terms_and_conditions);
        }
        if (error?.error?.error) {
          this.toastr.error(error?.error?.error);
        } else if (error?.message) {
          this.toastr.error(error?.message);

        } else {
          this.toastr.error("Oops! Something went wrong with the server!!");
        }
        this.isAuthLoading = false;
      })
    } else {
      this.toastr.error('Form is not valid!');
    }
  }



  ngOnDestroy() {
    this.renderer.removeClass(
      document.querySelector('app-root'),
      'register-page'
    );
  }
}
