import {Component, OnInit} from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import {DateTime} from 'luxon';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    public user;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.user = this.authService.getUser();
    }

    logout() {
        this.authService.logout();
    }

    formatDate(date) {
        return DateTime.fromRFC2822(date).toFormat('dd LLL yyyy');
    }
}
