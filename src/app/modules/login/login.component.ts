import {
    Component,
    OnInit,
    OnDestroy,
    Renderer2,
    HostBinding
} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { AuthService } from '@services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'w-100';//'login-box';
    public loginForm: UntypedFormGroup;
    public isAuthLoading = false;

    constructor(
        private router:Router,
        private renderer: Renderer2,
        private toastr: ToastrService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'login-page'
        );
        this.loginForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, Validators.required),
            password: new UntypedFormControl(null, Validators.required)
        });
    }

    async loginByAuth() {
        if (this.loginForm.valid) {
            this.isAuthLoading = true;
            this.authService.login(this.loginForm.getRawValue()).subscribe((result: any) => {
                if(result.access_token && result.user){
                    localStorage.setItem("token", result.access_token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    localStorage.setItem('permissions', JSON.stringify(result.permissions));
                }else{
                    this.toastr.error("Access token could not be found! Try again!")
                }
                this.router.navigate(['dashboard']);
                this.isAuthLoading = false;
            }, (error: any) => {
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
            'login-page'
        );
    }
}
