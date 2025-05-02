import {Injectable} from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    Route,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router
} from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NonAuthGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (!this.authService.getUser()) {
            return true;
        }
        this.router.navigate(['/']);
        return false;
    }
    canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.canActivate(next, state);
    }
}
