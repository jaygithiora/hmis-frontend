import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-frontend',
  templateUrl: './frontend.component.html',
  styleUrl: './frontend.component.scss'
})
export class FrontendComponent {
  service  = inject(AuthService);
  router  = inject(Router);
  cdr = inject(ChangeDetectorRef);
  //isNavbarCollapsed = true;
  isMenuCollapsed = true;

  dashboard(){
    this.router.navigate(['dashboard']).then(() => {
      this.cdr.detectChanges(); // Force change detection
    });
  }
}
