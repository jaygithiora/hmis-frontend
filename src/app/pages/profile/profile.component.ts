import {Component} from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
    public activeTabSubject = new BehaviorSubject<string>('ACTIVITY');
    activeTab$ = this.activeTabSubject.asObservable();

    public user;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.user = this.authService.getUser();
    }

    setActiveTab(tab: string) {
        this.activeTabSubject.next(tab);
    }

    toggle(tab: string) {
        this.setActiveTab(tab);
    }
}
