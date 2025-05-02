import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const service = inject(AuthService);
    const router = inject(Router);
    if (service.isLoggedIn()) {
        return true;
    } else {
        router.navigateByUrl("/auth/login");
        return false;
    }
};