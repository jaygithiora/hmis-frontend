import {
    Component,
    OnInit,
    Renderer2,
    OnDestroy,
    HostBinding
} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'register-box';

    public registerForm: UntypedFormGroup;
    public isAuthLoading = false;
    public isGoogleLoading = false;
    public isFacebookLoading = false;

    constructor(
        private renderer: Renderer2,
        private toastr: ToastrService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.renderer.addClass(
            document.querySelector('app-root'),
            'register-page'
        );
        this.registerForm = new UntypedFormGroup({
            email: new UntypedFormControl(null, Validators.required),
            password: new UntypedFormControl(null, [Validators.required]),
            retypePassword: new UntypedFormControl(null, [Validators.required])
        });
    }

    async registerByAuth() {
        if (this.registerForm.valid) {
            this.isAuthLoading = true;
            this.authService.login(this.registerForm.getRawValue()).subscribe((result: any) => {
                if(result.access_token && result.user){
                    localStorage.setItem("token", result.access_token);
                    localStorage.setItem('user', JSON.stringify(result.user));
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
            'register-page'
        );
    }
}
